using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Text.RegularExpressions;
using System.IO;
using Newtonsoft.Json;
using HtmlAgilityPack;
using SEOAnalyserAPI.Logic.Interface;
using SEOAnalyserAPI.Common;
using SEOAnalyserAPI.Providers.Interface;
using SEOAnalyserAPI.Providers.DataModels;
using SEOAnalyserAPI.Common.Common;
using NUglify;
using SEOAnalyserAPI.Common.Models;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;

namespace SEOAnalyserAPI.Logic.Managers
{
    public class AnalysisTextManager: IAnalysisManager
    {
        IDataProvider _dataProvider;
        IHostingEnvironment _hostingEnvironment;

        public AnalysisTextManager(IDataProvider dataProvider, IHostingEnvironment environment) {
            _dataProvider = dataProvider;
            _hostingEnvironment = environment;
        }
        public async Task<Dictionary<string, int>> GetAllWordsInfo(string searchText, bool isPageFilterStopWords) {
            var listOfWords = new List<string>();

            listOfWords = await Util.GetAllWords(searchText);

            if (isPageFilterStopWords)
            {
                listOfWords = await Util.FilterStopWords(listOfWords, Path.Combine(_hostingEnvironment.WebRootPath, Constant.StopWordsPath));
            }
            return await Util.GroupListOfString(listOfWords);
        }

        public async Task<List<MetaTagInfo>> GetAllMetaTagsInfo(string searchText, bool isPageFilterStopWords) {

            return new List<MetaTagInfo>();
        }
        public async Task<Dictionary<string, int>> GetAllExternalLinks(string searchText) {
            var listofURL = new List<string>();
            listofURL = await Util.GetAllExternalLinksFromText(searchText);
            return await Util.GroupListOfString(listofURL);
        }
    }
}
