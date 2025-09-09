using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;

namespace AdBoard.API.Configurations
{
    public static class JsonSerializerConfiguration
    {
        public static IMvcBuilder AddCustomJsonSerializerOptions(this IMvcBuilder builder)
        {
            builder.Services.Configure<JsonOptions>(options =>
            {
                options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
                options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
            });
            return builder;
        }
    }
}
