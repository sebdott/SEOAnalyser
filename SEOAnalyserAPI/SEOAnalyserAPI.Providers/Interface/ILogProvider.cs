
using SEOAnalyserAPI.Common.Models;
using SEOAnalyserAPI.Providers.DataModels;
using System;
using System.Threading.Tasks;

namespace SEOAnalyserAPI.Providers.Interface
{
    public interface ILogProvider
    {
        Task PublishInfo(string identifier, string message);
        Task PublishError(string identifier, ExceptionItem exceptionItem);
        
    }
}
