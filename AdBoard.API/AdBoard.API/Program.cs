
using AdBoard.API.Configurations;
using AdBoard.API.Middleware;
using AdBoard.DAL;
using AdBoard.Services.Implementations;
using AdBoard.Services.Interfaces;
using AdBoard.Services.Models.Configurations;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
namespace AdBoard.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddDbContext<AdBoardDbContext>();
            builder.Services.AddAuthentication(opt =>
            {
                opt.DefaultAuthenticateScheme = "CustomScheme";
                opt.DefaultChallengeScheme = "CustomScheme";
            }).AddScheme<AuthenticationSchemeOptions, CustomAuthenticationHandler>("CustomScheme", null);
            builder.Services.AddAuthorization();
            builder.Services.AddControllers()
                .AddCustomJsonSerializerOptions();

            builder.Services.AddEndpointsApiExplorer();

            builder.Services.AddSwaggerGen()
                .AddCustomSwaggerOptions();

            builder.Services.Configure<SecurityOptions>(builder.Configuration.GetSection("Security"));

            builder.Services.AddScoped<IJwtService, JwtService>();
            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger(); 
                app.UseSwaggerUI();
            }
            app.UseMiddleware<JwtAuthenticationMiddleware>();
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();
            app.Run();
        }
    }
}
