using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using Database;
using Werewolf_Control.Handler;
using Werewolf_Control.Helpers;
using Timer = System.Timers.Timer;

namespace Werewolf_Control
{
    internal static class Program
    {
        internal static bool Running = true;
        private static bool _writingInfo;

        internal static float AvgCpuTime;

        /// private static List
        /// <float> CpuTimes = new List<float>();
        internal static readonly List<long> MessagesReceived = new List<long>();

        internal static readonly List<long> MessagesProcessed = new List<long>();
        internal static readonly List<long> MessagesSent = new List<long>();
        private static long _previousMessages, _previousMessagesTx, _previousMessagesRx;
        internal static float MessagePxPerSecond, MessageRxPerSecond, MessageTxPerSecond;
        private static int _nodeMessagesSent;
        private static Timer _timer;
        public static int MaxGames;
        public static DateTime MaxTime = DateTime.MinValue;
        public static bool MaintMode = false;

        private static Process node;

        private static void Main(string[] args)
        {
            AppDomain.CurrentDomain.UnhandledException += (sender, eventArgs) =>
            {
                var e = eventArgs.ExceptionObject as Exception;

                Console.WriteLine(DateTime.UtcNow);
                Console.WriteLine(e.Message);
                Console.WriteLine(e.StackTrace + "\n");

                if (eventArgs.IsTerminating)
                {
                    Environment.Exit(5);
                }
            };

            //get the version of the bot and set the window title
            var assembly = Assembly.GetExecutingAssembly();
            var fvi = FileVersionInfo.GetVersionInfo(assembly.Location);
            var version = fvi.FileVersion;
            Console.Title = $"Werewolf Moderator {version}";


            //Make sure another instance isn't already running
            if (Process.GetProcessesByName(Process.GetCurrentProcess().ProcessName).Length > 1)
            {
                Environment.Exit(2);
            }


            var updateid = "";
            //attempt to get id from update
            if (args.Length > 0)
            {
                updateid = args[0];
            }

            //Initialize the TCP connections
            TCP.Initialize();
            //Let the nodes reconnect
            Thread.Sleep(1000);

            //initialize EF before we start receiving
            using (var db = new WWContext())
            {
                var count = db.GlobalBans.Count();
            }

            //start up the bot
            Task.Run(() => Bot.Initialize(updateid));
            Task.Run(() => NodeMonitor());
            Task.Run(() => UpdateHandler.SpamDetection());
            Task.Run(() => UpdateHandler.BanMonitor());

            _timer = new Timer();
            _timer.Elapsed += TimerOnTick;
            _timer.Interval = 1000;
            _timer.Enabled = true;

            //now pause the main thread to let everything else run
            Thread.Sleep(-1);
        }


        private static void TimerOnTick(object sender, EventArgs eventArgs)
        {
            try
            {
                var newMessages = Bot.MessagesProcessed - _previousMessages;
                _previousMessages = Bot.MessagesProcessed;
                MessagesProcessed.Insert(0, newMessages);
                if (MessagesProcessed.Count > 60)
                {
                    MessagesProcessed.RemoveAt(60);
                }

                MessagePxPerSecond = MessagesProcessed.Max();

                newMessages = Bot.MessagesSent + _nodeMessagesSent - _previousMessagesTx;
                _previousMessagesTx = Bot.MessagesSent + _nodeMessagesSent;
                MessagesSent.Insert(0, newMessages);
                if (MessagesSent.Count > 60)
                {
                    MessagesSent.RemoveAt(60);
                }

                MessageTxPerSecond = MessagesSent.Max();

                newMessages = Bot.MessagesReceived - _previousMessagesRx;
                _previousMessagesRx = Bot.MessagesReceived;
                MessagesReceived.Insert(0, newMessages);
                if (MessagesReceived.Count > 60)
                {
                    MessagesReceived.RemoveAt(60);
                }

                MessageRxPerSecond = MessagesProcessed.Max();
            }
            catch
            {
                // ignored
            }
        }

        internal static string GetVersion()
        {
            var assembly = Assembly.GetExecutingAssembly();
            var fvi = FileVersionInfo.GetVersionInfo(assembly.Location);
            var version = fvi.FileVersion;
            var dt = new DateTime(2000, 1, 1, 0, 0, 0, DateTimeKind.Local).AddDays(fvi.ProductBuildPart)
                .AddSeconds(fvi.ProductPrivatePart * 2).ToLocalTime();
            return "Current Version: " + version + Environment.NewLine + "Build time: " + dt + " (Central)";
        }

        public static void Log(string s, bool error = false) { }

        internal static string GetFullInfo()
        {
            var nodes = Bot.Nodes.OrderBy(x => x.Version).ToList();
            _nodeMessagesSent = nodes.Sum(x => x.MessagesSent);
            var currentPlayers = nodes.Sum(x => x.CurrentPlayers);
            var currentGames = nodes.Sum(x => x.CurrentGames);
            //var NumThreads = Process.GetCurrentProcess().Threads.Count;
            var uptime = DateTime.UtcNow - Bot.StartTime;
            var messagesRx = Bot.MessagesProcessed;
            var commandsRx = Bot.CommandsReceived;
            var messagesTx = nodes.Sum(x => x.MessagesSent) + Bot.MessagesSent;

            if (currentGames > MaxGames)
            {
                MaxGames = currentGames;
                MaxTime = DateTime.UtcNow;
            }

            //Threads: {NumThreads}\t
            var msg =
                $"`Uptime   : {uptime}`\n" +
                $"`Nodes    : {nodes.Count}`\n" +
                $"`Players  : {currentPlayers}`\n" +
                $"`Games    : {currentGames}`\n" +
                $"`Msgs Rx  : {messagesRx}`\n" +
                $"`Cmds Rx  : {commandsRx}`\n" +
                $"`Msgs Tx  : {messagesTx}`\n" +
                $"`MPS (IN) : {MessagePxPerSecond}`\n" +
                $"`MPS (OUT): {MessageTxPerSecond}`\n" +
                $"`Max Games: {MaxGames} at {MaxTime:T}`\n\n";


            try
            {
                msg = nodes.Aggregate(msg,
                    (current, n) =>
                        current +
                        $"`{(n.ShuttingDown ? "X " : "  ")}{n.ClientId}`\n`  {n.Version}` - *Games: {n.Games.Count}*\n");
            }
            catch
            {
                // ignored
            }

            return msg;
        }

        private static void NodeMonitor()
        {
            //wait a bit to allow nodes to register
            Thread.Sleep(2000);
            while (Running)
            {
                try
                {
                    var nodes = Bot.Nodes.OrderBy(x => x.Version).ToList();
                    _nodeMessagesSent = nodes.Sum(x => x.MessagesSent);
                    var currentPlayers = nodes.Sum(x => x.CurrentPlayers);
                    var currentGames = nodes.Sum(x => x.CurrentGames);
                    var totalPlayers = nodes.Sum(x => x.TotalPlayers);
                    var totalGames = nodes.Sum(x => x.TotalGames);
                    //var NumThreads = Process.GetCurrentProcess().Threads.Count;
                    var uptime = DateTime.UtcNow - Bot.StartTime;
                    var messagesRx = Bot.MessagesProcessed;
                    var commandsRx = Bot.CommandsReceived;
                    var messagesTx = nodes.Sum(x => x.MessagesSent) + Bot.MessagesSent;

                    if (currentGames > MaxGames)
                    {
                        MaxGames = currentGames;
                        MaxTime = DateTime.UtcNow;
                    }

                    //Threads: {NumThreads}\t
                    var msg =
                        $"Connected Nodes: {nodes.Count}  \n" +
                        $"Current Players: {currentPlayers}  \tCurrent Games: {currentGames}  \n" +
                        //$"Total Players: {TotalPlayers}  \tTotal Games: {TotalGames}  \n" +
                        $"Uptime: {uptime}\n" +
                        $"Messages Rx: {messagesRx}\tCommands Rx: {commandsRx}\tMessages Tx: {messagesTx}\n" +
                        $"Messages Per Second (IN): {MessagePxPerSecond}\tMessage Per Second (OUT): {MessageTxPerSecond}\t\n" +
                        $"Max Games: {MaxGames} at {MaxTime:T}\t\n\n";


                    try
                    {
                        msg = nodes.Aggregate(msg,
                            (current, n) =>
                                current +
                                $"{(n.ShuttingDown ? "X " : "  ")}{n.ClientId} - {n.Version} - Games: {n.Games.Count}\t\n");
                    }
                    catch
                    {
                        // ignored
                    }

                    msg += new string(' ', Console.WindowWidth);
                    msg += Environment.NewLine + new string(' ', Console.WindowWidth);

                    _writingInfo = true;
                    //var ypos = Math.Max(Console.CursorTop, 30);
                    //if (ypos >= 60)
                    //    ypos = 30;
                    Console.CursorTop = 0;
                    //var xpos = Console.CursorLeft;
                    Console.CursorLeft = 0;
                    Console.Clear();
                    //write the info
                    //Console.WriteLine(msg);
                    //put the cursor back;
                    //Console.CursorTop = ypos;
                    //Console.CursorLeft = xpos;
                    _writingInfo = false;


                    #if !DEBUG
                    //now, let's manage our nodes.
                    if (nodes.All(x => (x.Games.Count <= Settings.ShutDownNodesAt) & !x.ShuttingDown) &&
                        nodes.Count > 1)
                    {
                        //we have too many nodes running, kill one.
                        nodes.First().ShutDown();
                    }

                    if (!MaintMode)
                    {
                        if (nodes.Where(x => !x.ShuttingDown).All(x => x.Games.Count >= Settings.NewNodeThreshhold) ||
                            nodes.All(x => x.ShuttingDown))
                        {
                            node = NewNode();
                            Thread.Sleep(5000); //give the node time to register
                        }
                    }
                    #endif
                }
                finally
                {
                    _writingInfo = false;
                }

                Thread.Sleep(1000);
            }
        }

        private static Process NewNode()
        {
            //all nodes have quite a few games, let's spin up another
            //this is a bit more tricky, we need to figure out which node folder has the latest version...

            var process = Process.Start(Path.Combine(Bot.RootDirectory, "../Node/WerewolfNode.exe"));

            Task.Run(() =>
            {
                int ch;

                while ((ch = process.StandardOutput.Read()) != -1)
                {
                    Console.Write((char) ch);
                }
            });

            Task.Run(() =>
            {
                int ch;

                while ((ch = process.StandardError.Read()) != -1)
                {
                    Console.Write((char) ch);
                }
            });

            return process;
        }
    }

    internal class NodeChoice
    {
        public string Path { get; set; }
        public Version Version { get; set; } = Version.Parse("0.0.0.0");
    }
}