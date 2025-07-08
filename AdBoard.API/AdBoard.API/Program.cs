
using AdBoard.API.Configurations;
using AdBoard.DAL;
using Microsoft.OpenApi.Models;
using System.Reflection;
using System.Text.Json.Serialization;
namespace AdBoard.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers()
                .AddCustomJsonSerializerOptions();

            builder.Services.AddEndpointsApiExplorer();

            builder.Services.AddSwaggerGen()
                .AddCustomSwaggerOptions();

            builder.Services.AddDbContext<AdBoardDbContext>();
            var app = builder.Build();
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger(); 
                app.UseSwaggerUI();
            }

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
