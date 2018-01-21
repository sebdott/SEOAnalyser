using System;
using SEOAnalyserAPI.Providers.Interface;
using SEOAnalyserAPI.Logic.Interface;
using System.Threading.Tasks;
using SEOAnalyserAPI.Common.Models;

namespace SEOAnalyserAPI.Logic.Managers
{
    public class ExceptionManager : IExceptionManager
    {
        IDataProvider _dataProvider;
        ILogProvider _logProvider;

        public ExceptionManager(IDataProvider dataProvider, ILogProvider logProvider)
        {
            _dataProvider = dataProvider;
            _logProvider = logProvider;
        }
        public async Task<ExceptionItem> HandleError(string identifier, Exception ex)
        {
            var exceptionItem = new ExceptionItem();

            try
            {
                await HandleErrorManagement(identifier, exceptionItem, ex);
                await _logProvider.PublishError("RegisterSearchText", exceptionItem);
            }
            catch (Exception)
            {
            }

            return exceptionItem;
        }


        private async Task HandleErrorManagement(string identifier ,ExceptionItem exceptionItem, Exception ex)
        {
            exceptionItem.Source = ex.Source;
            exceptionItem.ErrorMethod = identifier;
            exceptionItem.Message = ex.Message;

            if (ex.InnerException != null)
            {
                await HandleErrorManagement("inner_"+ identifier , exceptionItem, ex.InnerException);
            }
        }
    }
}
