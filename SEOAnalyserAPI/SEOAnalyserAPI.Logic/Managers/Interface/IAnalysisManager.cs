using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Text.RegularExpressions;
using System.IO;
using Newtonsoft.Json;
using System.Threading.Tasks;
using SEOAnalyserAPI.Common.Models;

namespace SEOAnalyserAPI.Logic.Interface
{
    public interface IAnalysisManager
    {
        Task<Dictionary<string, int>> GetAllWordsInfo(string searchText, bool isPageFilterStopWords);
        Task<List<MetaTagInfo>> GetAllMetaTagsInfo(string searchText, bool isPageFilterStopWords);
        Task<Dictionary<string, int>> GetAllExternalLinks(string searchText);

    }
}
