using Newtonsoft.Json;
using SEOAnalyserAPI.Common;
using SEOAnalyserAPI.Common.Common;
using SEOAnalyserAPI.Providers.DataModels;
using SEOAnalyserAPI.Providers.Interface;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Distributed;
using System.Text;
using Microsoft.Extensions.Options;

namespace SEOAnalyserAPI.Providers
{
    public class RedisProvider : IDataProvider
    {
        private readonly IDistributedCache _redisDB;
        private RedisSettings _redisSettings;

        public RedisProvider(IDistributedCache redisDB, IOptions<RedisSettings> redisSettings)
        {
            _redisSettings = redisSettings.Value;
            _redisDB = redisDB;
        }

        public async Task<T> Get<T>(string key)
        {
            try
            {
                var value = await _redisDB.GetAsync(string.Format(Constant.RedisFormat, _redisSettings.Category, key));
                if (value != null)
                {
                    var cachedMessage = Encoding.UTF8.GetString(value);
                    return JsonConvert.DeserializeObject<T>(cachedMessage);
                }
                else
                {
                    return default(T);
                }
            }
            catch (Exception)
            {

                throw;
            }

        }

        public async Task Set(string key, object value, int expirationInSeconds)
        {
            var distributedOptions = new DistributedCacheEntryOptions(); // create options object
            distributedOptions.SetSlidingExpiration(TimeSpan.FromSeconds(_redisSettings.Timeout));
            await _redisDB.SetStringAsync(string.Format(Constant.RedisFormat, _redisSettings.Category, key), JsonConvert.SerializeObject(value), distributedOptions);
        }
    }
}
