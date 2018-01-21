using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using SEOAnalyserAPI.Providers.Interface;
using SEOAnalyserAPI.Logic.Interface;
using SEOAnalyserAPI.Providers.DataModels;
using SEOAnalyserAPI.Common.Models;

namespace SEOAnalyserAPI.Controllers
{
    [Route("api/[controller]/[action]")]
    public class AnalyserController : Controller
    {
        IDataProvider _dataProvider;
        IProcessManager _processManager;
        IExceptionManager _exceptionManager;
        ILogProvider _logProvider;
        private readonly Func<string, IAnalysisManager> _analysisManager;

        public AnalyserController(IDataProvider dataProvider,
            IProcessManager processManager,
            IExceptionManager exceptionManager,
            ILogProvider logProvider,
            Func<string, IAnalysisManager> analysisManager)
        {
            _dataProvider = dataProvider;
            _processManager = processManager;
            _exceptionManager = exceptionManager;
            _analysisManager = analysisManager;
            _logProvider = logProvider;
        }

        [HttpPost]
        public async Task<IActionResult> RegisterSearchText([FromBody] Analyser analyser)
        {
            Guid ID = Guid.Empty;
            try
            {
                if (analyser.IsURL)
                {
                    await ValidateURL(analyser.SearchText);
                }

                ID = await _processManager.RegisterSearchText(analyser);
            }
            catch (Exception ex)
            {
                var exceptionItem = await _exceptionManager.HandleError("RegisterSearchText", ex);

                return NotFound(exceptionItem);
            }

            return Ok(ID);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllWordsInfo(string searchID)
        {

            Dictionary<string, int> wordsDictionary = null;

            try
            {
                var analyserObj = await ValidateSearchID(searchID);
                await ValidateFilter(analyserObj, "GetAllWordsInfo");

                if (analyserObj != null)
                {
                    wordsDictionary = await _analysisManager(analyserObj.IsURL ? "URL" : "Text").GetAllWordsInfo(analyserObj.SearchText, analyserObj.IsPageFilterStopWords);
                }

            }
            catch (Exception ex)
            {
                var exceptionItem = await _exceptionManager.HandleError("GetAllWordsInfo", ex);

                return NotFound(exceptionItem);
            }

            return Ok(wordsDictionary.ToList());
        }

        [HttpGet]
        public async Task<IActionResult> GetAllMetaTagsInfo(string searchID)
        {
            var listOfMetaTagInfo = new List<MetaTagInfo>();
            try
            {
                var analyserObj = await ValidateSearchID(searchID);
                await ValidateFilter(analyserObj, "GetAllMetaTagsInfo");

                if (analyserObj != null)
                {
                    listOfMetaTagInfo = await _analysisManager(analyserObj.IsURL ? "URL" : "Text").GetAllMetaTagsInfo(analyserObj.SearchText, analyserObj.IsPageFilterStopWords);
                }
            }
            catch (Exception ex)
            {
                var exceptionItem = await _exceptionManager.HandleError("GetAllMetaTagsInfo", ex);

                return NotFound(exceptionItem);
            }

            return Ok(listOfMetaTagInfo);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllExternalLinks(string searchID)
        {
            Dictionary<string, int> wordsDictionary = null;
            try
            {
                var analyserObj = await ValidateSearchID(searchID);
                await ValidateFilter(analyserObj, "GetAllExternalLinks");

                if (analyserObj != null)
                {
                    wordsDictionary = await _analysisManager(analyserObj.IsURL ? "URL" : "Text").GetAllExternalLinks(analyserObj.SearchText);
                }
            }
            catch (Exception ex)
            {
                var exceptionItem = await _exceptionManager.HandleError("GetAllExternalLinks", ex);

                return NotFound(exceptionItem);
            }

            return Ok(wordsDictionary.ToList());
        }

        private async Task<Analyser> ValidateSearchID(string searchID)
        {
            var analyserObj = await _dataProvider.Get<Analyser>(searchID);
            if (analyserObj == null || string.IsNullOrWhiteSpace(analyserObj.SearchText))
            {
                throw new Exception("SearchID not found");
            }

            return analyserObj;
        }

        private async Task<bool> ValidateURL(string searchText)
        {
            var isURLValid = await _processManager.IsURLValidAsync(searchText);

            if (!isURLValid)
            {
                throw new Exception("URL given is not Valid");
            }

            return true;
        }

        private async Task ValidateFilter(Analyser analyser, string page)
        {
            await Task.Run(() =>
            {
                if (!analyser.IsCountNumberofWords && page == "GetAllWordsInfo")
                {
                    throw new Exception("You never choose this filter [Get all words]");
                }

                if (!analyser.IsMetaTagsInfo && page == "GetAllMetaTagsInfo")
                {
                    throw new Exception("You never choose this filter [Get all meta tags]");
                }

                if (!analyser.IsGetExternalLink && page == "GetAllExternalLinks")
                {
                    throw new Exception("You never choose this filter [Get all external links]");
                }
            });
        }

    }
}
