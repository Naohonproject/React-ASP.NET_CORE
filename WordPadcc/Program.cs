using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WordPadcc
{
    public class Program
    {
        // entry of our App.Main Function, Configure a Server,Build and Run that server when App start
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        // this function will configure a Host with Startup class
        // Startup(any name will be ok) have to has 2 function  public void ConfigureServices(IServiceCollection services) and
        // public void Configure(IApplicationBuilder app, IWebHostEnvironment env) and is a public class
        // this function return IHostBuilder to Build a Host , this Host run our app by Kestrel web server by default
        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
