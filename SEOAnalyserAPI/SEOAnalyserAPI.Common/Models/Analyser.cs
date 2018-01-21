using System;
using System.Collections.Generic;
using System.Text;

namespace SEOAnalyserAPI.Common.Models
{
    public class Analyser
    {
        public string SearchText { get; set; }
        public bool IsURL { get; set; }
        public bool IsPageFilterStopWords { get; set; }
        public bool IsCountNumberofWords { get; set; }
        public bool IsMetaTagsInfo { get; set; }
        public bool IsGetExternalLink { get; set; }
    }
}
