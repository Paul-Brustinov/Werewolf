//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Database
{
    using System;
    using System.Collections.Generic;
    
    public partial class PlayerStat
    {
        public int PlayerId { get; set; }
        public int GamesPlayed { get; set; }
        public int GamesWon { get; set; }
        public int GamesLost { get; set; }
        public string MostCommonRole { get; set; }
        public string MostKilled { get; set; }
        public string MostKilledBy { get; set; }
        public int MostCommonRolePercent { get; set; }
        public int GamesSurvived { get; set; }
        public Nullable<System.DateTime> LastRun { get; set; }
    }
}