using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Swashbuckle.AspNetCore.Swagger;
using SEOAnalyserAPI.Providers.DataModels;
using SEOAnalyserAPI.Providers.Interface;
using SEOAnalyserAPI.Providers;
using Microsoft.AspNetCore.ResponseCompression;
using SEOAnalyserAPI.Logic.Interface;
using SEOAnalyserAPI.Logic.Managers;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.AspNetCore.Mvc.Cors.Internal;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;

namespace SEOAnalyserAPI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }
        public IConfiguration Configuration { get; }
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<GzipCompressionProviderOptions>(options => options.Level = System.IO.Compression.CompressionLevel.Optimal);
            services.AddResponseCompression();

            services.AddSingleton<ILogProvider, LogProvider>();
            services.AddSingleton<IProcessManager, ProcessManager>();
            services.AddSingleton<IExceptionManager, ExceptionManager>();
            services.AddSingleton<IDataProvider, RedisProvider>();

            AnalysisManagerFactory(services);

            services.AddSwaggerGen(c =>
            {
                c.DescribeAllEnumsAsStrings();
                c.SwaggerDoc("v1", new Info
                {
                    Version = "v1",
                    Title = "SEOAnalyserAPI",
                    Description = "SEOAnalyserAPI",
                    TermsOfService = "None",
                });

            });

            services.Configure<GraylogSettings>(Configuration.GetSection("GraylogSettings"));
            services.Configure<RedisSettings>(Configuration.GetSection("RedisSettings"));
            services.AddOptions();

            services.AddDistributedRedisCache(options =>
            {
                options.Configuration = Configuration["RedisSettings:Host"].ToString();
            });
            services.Configure<MvcOptions>(options =>
            {
                options.Filters.Add(new CorsAuthorizationFilterFactory("AllowSpecificOrigin"));
            });
            //options.AddPolicy("AllowSpecificOrigin",
            //  builder => builder.WithOrigins(Configuration["CORS:Host1"].ToString()).WithOrigins(Configuration["CORS:Host2"].ToString()).
            //  AllowAnyHeader().AllowAnyMethod()
            //  );
            //"http://localhost:3000", "http://localhost:8000", 
            services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigin",
                    builder => builder.WithOrigins("*").
                    AllowAnyHeader().AllowAnyMethod()
                    );
            });


            services.AddMvc();

        }
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            app.UseResponseCompression();
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.DocumentTitle("SEOAnalyserAPI");
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "SEOAnalyserAPI V1");
            });
            app.UseStaticFiles();


            //app.UseCors(builder => builder
            //    .AllowAnyOrigin()
            //    .AllowAnyMethod()
            //    .AllowAnyHeader()
            //    .SetIsOriginAllowedToAllowWildcardSubdomains()
            //    .AllowCredentials());

            app.UseCors("AllowSpecificOrigin");
            app.UseMvc();
        }
        private void AnalysisManagerFactory(IServiceCollection services)
        {
            services.AddTransient<AnalysisTextManager>();
            services.AddTransient<AnalysisURLManager>();

            services.AddTransient(factory =>
            {
                Func<string, IAnalysisManager> accesor = key =>
                {
                    switch (key)
                    {
                        case "Text":
                            return factory.GetService<AnalysisTextManager>();
                        case "URL":
                            return factory.GetService<AnalysisURLManager>();
                        default:
                            throw new KeyNotFoundException(); // or maybe return null, up to you
                    }
                };
                return accesor;
            });

        }

    }
}
