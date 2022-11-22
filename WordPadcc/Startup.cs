using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using WordPadcc.Models;
using Microsoft.EntityFrameworkCore;
// using Alachisoft.NCache.Web.SessionState;
using Alachisoft.NCache.Caching.Distributed;

namespace WordPadcc
{
    public class Startup
    {
        // Inject
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        // declare Configuration Dependency
        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSignalR();
            services.AddDistributedMemoryCache();
            services.AddSession(option =>
            {
                option.Cookie.Name = "ltb";
                option.IdleTimeout = new System.TimeSpan(0, 60, 0);
            });
            // add dbContext to dependency container(service) to let runtime init and inject into our controller
            services.AddDbContext<WordPadDbContext>(options =>
            {
                // get connection string from appsetting.json
                string connectionString = Configuration.GetConnectionString("myConnection");
                // useNpgsql to use connect app with Podgresql by connection string
                options.UseNpgsql(connectionString);
            });

            // this statement to add relevant dependencies to be able to work with Controller and View in our app
            services.AddControllersWithViews();

            // this statement to add dependencies to dependency container to be able to work with SPA in production environment
            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            // middleware to work with error request in both development and production environment
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            // build in middleware to work with Static File request, Redirection, SPA
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            // this middleware to start routing in our Pipeline
            app.UseRouting();
            // middleware to let app work with Session
            app.UseSession();
            // Endpoint Middleware(terminate middleware)
            app.UseEndpoints(endpoints =>
            {
                // use MapControllers to map request context to Controllers and Actions
                endpoints.MapControllers();
                // map Socket request to handler
                endpoints.MapHub<RealtimeHubs>("/socket/notes/update");
            });

            // If all Requests endPoint does not match the controller and actions , the SPA will be serve, the those Url will be render by client
            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }
    }
}
