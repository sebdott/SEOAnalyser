using System;
using System.Collections.Generic;
using System.Text;

namespace SEOAnalyserAPI.Providers.DataModels
{
    public class ExceptionDTO
    {
        public string Source { get; set; }
        public string ErrorMethod { get; set; }
        public string Message { get; set; }
        public ExceptionDTO InnerExceptionDTO { get; set; }

    }
}
