using System;
using System.Collections.Generic;
using System.Text;

namespace SEOAnalyserAPI.Common.Common
{
    public class Constant
    {
        public const string LoggingFormat = "{0} - {1}";
        public const string AppSettingsFile = "appsettings.json";
        public const string RedisFormat = "{0}_{1}";
        public const string StopWordsPath = "Assets/stopWords.json";
    }

    public class Status
    {
        public const string New = "New";
        public const string Success = "Success";
        public const string Failure = "Failure";
    }

    public class FilterFormat
    {
        public const string GetAllLinks = @"((http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?)";
    }

    public class LogType
    {
        public const string Error = "Exception";
        public const string Information = "Information";
    }
}
