using Werewolf_Control.Helpers;

namespace Werewolf_Control.Models
{
    internal class Command
    {
        public string Trigger { get; set; }
        public bool GroupAdminOnly { get; set; }
        public bool GlobalAdminOnly { get; set; }
        public bool DevOnly { get; set; }
        public bool Blockable { get; set; }
        public Bot.ChatCommandMethod Method { get; set; }
        public bool InGroupOnly { get; set; }
    }
}