using Swashbuckle.AspNetCore.Swagger;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Reflection;
using System.Runtime.CompilerServices;

namespace AdBoard.API.Configurations
{
    public static class SwaggerConfiguration
    {
        public static IServiceCollection AddCustomSwaggerOptions(this IServiceCollection services)
        {
            services.Configure<SwaggerGenOptions>(options =>
            {
                var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
            });
            return services;
        }
    }
}
