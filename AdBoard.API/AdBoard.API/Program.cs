
using AdBoard.API.Configurations;
using AdBoard.API.Middleware;
using AdBoard.DAL;
using AdBoard.Services.Implementations;
using AdBoard.Services.Interfaces;
using AdBoard.Services.Models.Configurations;
using AdBoard.Services.Models.DTOs.Requests;
using AdBoard.Services.Validators;
using FluentValidation;
using Microsoft.AspNetCore.Authentication;
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

            builder.Services.AddScoped<IValidator<RegistrationDto>, RegistrationDtoValidator>();
            builder.Services.AddScoped<IValidator<LoginDto>, LoginDtoValidator>();

            builder.Services.AddScoped<IJwtService, JwtService>();
            builder.Services.AddScoped<IHttpHeadersService, HttpHeadersService>();
            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<IUserService,UserService>();
            builder.Services.AddEndpointsApiExplorer();

            builder.Services.AddSwaggerGen()
                .AddCustomSwaggerOptions();

            builder.Services.Configure<SecurityOptions>(builder.Configuration.GetSection("Security"));

            var app = builder.Build();
            app.UseMiddleware<GlobalExceptionHandler>();
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
