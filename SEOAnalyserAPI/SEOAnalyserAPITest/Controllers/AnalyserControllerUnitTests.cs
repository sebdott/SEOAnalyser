using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Moq;
using SEOAnalyserAPI.Common.Models;
using SEOAnalyserAPI.Controllers;
using SEOAnalyserAPI.Logic.Interface;
using SEOAnalyserAPI.Logic.Managers;
using SEOAnalyserAPI.Providers;
using SEOAnalyserAPI.Providers.Interface;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace SEOAnalyserAPITest
{
    public class AnalyserControllerUnitTests
    {
        private Mock<IDataProvider> _dataProviderMock;
        private Mock<IProcessManager> _processManagerMock;
        private Mock<IExceptionManager> _exceptionManagerMock;
        private Mock<ILogProvider> _logProviderMock;
        private Mock<IHostingEnvironment> _hostingEnvironment;
        private Func<string, IAnalysisManager> _analysisManager;

        public AnalyserControllerUnitTests()
        {
            _dataProviderMock = new Mock<IDataProvider>();
            _processManagerMock = new Mock<IProcessManager>();
            _exceptionManagerMock = new Mock<IExceptionManager>();
            _logProviderMock = new Mock<ILogProvider>();
            _hostingEnvironment = new Mock<IHostingEnvironment>();
            _analysisManager = getAnalysisManager();
        }

        public Func<string, IAnalysisManager> getAnalysisManager()
        {
            Func<string, IAnalysisManager> accesor = key =>
            {
                switch (key)
                {
                    case "Text":
                        return new AnalysisTextManager(_dataProviderMock.Object, _hostingEnvironment.Object);
                    case "URL":
                        return new AnalysisURLManager(_dataProviderMock.Object, _hostingEnvironment.Object);
                    default:
                        throw new KeyNotFoundException();
                }
            };

            return accesor;
        }


        [Fact]
        public async Task RegisterSearchTextIsURLTrue()
        {
            try
            {

                var newGuid = Guid.NewGuid();
                var testAnalyser = new Analyser()
                {
                    SearchText = "oo",
                    IsURL = true,
                    IsPageFilterStopWords = true
                };

                _processManagerMock.Setup(x => x.IsURLValidAsync(It.IsAny<string>())).Returns(Task.FromResult<bool>(true))
                .Verifiable();

                _processManagerMock.Setup(x => x.RegisterSearchText(It.IsAny<Analyser>())).Returns(Task.FromResult<Guid>(newGuid))
                .Verifiable();

                _dataProviderMock.Verify();

                var controller = new AnalyserController(_dataProviderMock.Object, _processManagerMock.Object, _exceptionManagerMock.Object, _logProviderMock.Object, _analysisManager);

                IActionResult result = await controller.RegisterSearchText(testAnalyser);
                var okObjectResult = result as OkObjectResult;
                Assert.NotNull(okObjectResult);
                Assert.Equal(okObjectResult.Value, newGuid);
            }
            catch (Exception)
            {
                Assert.True(false);
            }
        }

        [Fact]
        public async Task RegisterSearchTextIsURLFalse()
        {
            try
            {

                var newGuid = Guid.NewGuid();
                var testAnalyser = new Analyser()
                {
                    SearchText = "oo",
                    IsURL = true,
                    IsPageFilterStopWords = true
                };

                _processManagerMock.Setup(x => x.IsURLValidAsync(It.IsAny<string>())).Returns(Task.FromResult<bool>(false))
                .Verifiable();

                var controller = new AnalyserController(_dataProviderMock.Object, _processManagerMock.Object, _exceptionManagerMock.Object, _logProviderMock.Object, _analysisManager);

                _dataProviderMock.Verify();

                IActionResult result = await controller.RegisterSearchText(testAnalyser);
                var okObjectResult = result as OkObjectResult;
                Assert.Null(okObjectResult);
            }
            catch (Exception)
            {
                Assert.True(false);
            }
        }
    }
}
