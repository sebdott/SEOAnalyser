using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Text.RegularExpressions;
using System.IO;
using Newtonsoft.Json;
using HtmlAgilityPack;
using SEOAnalyserAPI.Providers.Interface;
using SEOAnalyserAPI.Logic.Interface;
using SEOAnalyserAPI.Providers.DataModels;
using System.Threading.Tasks;
using SEOAnalyserAPI.Common.Models;

namespace SEOAnalyserAPI.Logic.Managers
{
    public class ProcessManager : IProcessManager
    {
        IDataProvider _dataProvider;

        public ProcessManager(IDataProvider dataProvider)
        {
            _dataProvider = dataProvider;
        }
        public async Task<Guid> RegisterSearchText(Analyser analyser)
        {
            var newID = Guid.NewGuid();
            await _dataProvider.Set(newID.ToString(), analyser, 3600);

            return newID;
        }

        public async Task<bool> IsURLValidAsync(string URL)
        {
            var isValidURL = false;
            try
            {
                var web = new HtmlWeb();
                var docURL = await web.LoadFromWebAsync(URL);
                if (docURL != null)
                {
                    isValidURL = true;
                }
            }
            catch (Exception)
            {
            }

            return isValidURL;
        }
    }
}
