
using System;
using System.Collections.Generic;
using System.Text;

namespace SEOAnalyserAPI.Common.Models
{
    public class LogItem
    {
        public string Identifier { get; set; }
        public string Message { get; set; }
        public string Exception { get; set; }
        public string Type { get; set; }
    }
}
