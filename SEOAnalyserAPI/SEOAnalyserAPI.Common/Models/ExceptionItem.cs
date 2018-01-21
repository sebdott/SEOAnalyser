
using System;
using System.Collections.Generic;
using System.Text;

namespace SEOAnalyserAPI.Common.Models
{
    public class ExceptionItem
    {
        public string Source { get; set; }
        public string ErrorMethod { get; set; }
        public string Message { get; set; }
        public ExceptionItem InnerException { get; set; }

    }
}
