using SEOAnalyserAPI.Common.Models;
using SEOAnalyserAPI.Providers.DataModels;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SEOAnalyserAPI.Logic.Interface
{
    public interface IProcessManager
    {
        Task<Guid> RegisterSearchText(Analyser analyser);
        Task<bool> IsURLValidAsync(string URL);
    }
}
