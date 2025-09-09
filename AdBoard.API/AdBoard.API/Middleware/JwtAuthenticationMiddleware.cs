using AdBoard.DAL;
using AdBoard.DAL.Entities;
using AdBoard.Services.Interfaces;
using System.Security.Claims;
namespace AdBoard.API.Middleware
{
    public class JwtAuthenticationMiddleware
    {
        private readonly RequestDelegate _next;

        public JwtAuthenticationMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context, IJwtService jwtService, AdBoardDbContext dbContext, ILogger<JwtAuthenticationMiddleware> logger)
        {
            var token = context.Request.Headers.Authorization.FirstOrDefault()?.Split(" ").Last();
            string? userId = await jwtService.ValidateToken(token);
            if (!string.IsNullOrEmpty(userId))
            {
                User? user = await dbContext.Users.FindAsync(Guid.Parse(userId));
                if (user == null)
                {
                    logger.LogError("Error in getting the user in auth middleware,the token is valid but user has not been found.");
                }
                else
                {
                    var claims = new[]
                        {
                            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                            new Claim(ClaimTypes.Name, user.Name)
                        };

                    var identity = new ClaimsIdentity(claims, "CustomAuthentication");
                    var principal = new ClaimsPrincipal(identity);

                    context.User = principal;
                }
            }
            await _next.Invoke(context);
        }
    }
}
