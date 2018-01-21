using SEOAnalyserAPI.Providers.DataModels;
using Serilog;
using Serilog.Sinks.Graylog;
using System;
using Microsoft.Extensions.Options;
using System.Threading;
using SEOAnalyserAPI.Providers.Interface;
using SEOAnalyserAPI.Common;
using SEOAnalyserAPI.Common.Common;
using SEOAnalyserAPI.Common.Models;
using Newtonsoft.Json;
using System.Threading.Tasks;

namespace SEOAnalyserAPI.Providers
{
    public class LogProvider : ILogProvider
    {
        private static Serilog.Core.Logger _logger;

        public LogProvider(IOptions<GraylogSettings> graylogSettings)
        {

            var retry = true;
            var retryNo = 0;

            while (retry)
            {
                try
                {
                    var loggerConfig = new LoggerConfiguration()
                                     .WriteTo.Graylog(new GraylogSinkOptions
                                     {
                                         HostnameOrAdress = graylogSettings.Value.Host,
                                         Port = graylogSettings.Value.Port
                                     });

                    if (_logger == null)
                    {
                        _logger = loggerConfig.CreateLogger();
                    }

                    retry = false;
                }
                catch (Exception ex)
                {
                    retryNo++;
                    Thread.Sleep(5000);
                }

                if (retryNo > 3)
                {
                    retry = false;
                }

            }
        }
        public async Task PublishInfo(string identifier, string message)
        {
            try
            {
                await Task.Run(() =>
                {
                    _logger.Information(string.Format(Constant.LoggingFormat, identifier, message));
                });
            }
            catch (Exception) { }
        }
        public async Task PublishError(string identifier, ExceptionItem exceptionItem)
        {
            try
            {
                await Task.Run(() =>
            {
                _logger.Error(string.Format(Constant.LoggingFormat, identifier, exceptionItem.Message), JsonConvert.SerializeObject(exceptionItem));
            });
            }
            catch (Exception) { }
        }
    }
}
