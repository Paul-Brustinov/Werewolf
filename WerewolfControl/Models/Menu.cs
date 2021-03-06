using System;
using System.Collections.Generic;
using Telegram.Bot.Types.InlineKeyboardButtons;

namespace Werewolf_Control.Models
{
    public class Menu
    {
        public Menu(int col = 1, List<InlineKeyboardButton> buttons = null)
        {
            Buttons = buttons ?? new List<InlineKeyboardButton>();
            Columns = Math.Max(col, 1);
        }

        /// <summary>
        ///     The buttons you want in your menu
        /// </summary>
        public List<InlineKeyboardButton> Buttons { get; set; }

        /// <summary>
        ///     How many columns.  Defaults to 1.
        /// </summary>
        public int Columns { get; set; }
    }
}