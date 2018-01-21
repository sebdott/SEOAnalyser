using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SEOAnalyserAPI.Providers.Interface
{
    public interface IDataProvider
    {
        Task<T> Get<T>(string key);
        Task Set(string key, object value, int expirationInSeconds);
    }
}
