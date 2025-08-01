using AdBoard.DAL.Entities;
using AdBoard.Services.Interfaces;
using AdBoard.Services.Models.Configurations;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace AdBoard.Services.Implementations
{
    public class JwtService : IJwtService
    {
        private readonly SecurityOptions _options;
        private readonly ILogger<IJwtService> _logger;
        public JwtService(IOptions<SecurityOptions> options, ILogger<IJwtService> logger)
        {
            _options = options.Value;
            _logger = logger;
        }

        public string GenerateAccessToken(User user)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var accessTokenKey = Encoding.ASCII.GetBytes(_options.JwtAccessTokenKey);
                var tokenDescriprot = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(
                    [
                        new Claim("id", user.Id.ToString()),
                    new Claim("name", user.Name)
                    ]),
                    Expires = DateTime.UtcNow.AddMinutes(_options.JwtAccessTokenDurationInMinutes),
                    SigningCredentials = new SigningCredentials(
                        new SymmetricSecurityKey(accessTokenKey),
                        SecurityAlgorithms.HmacSha256Signature
                    )
                };
                SecurityToken token = tokenHandler.CreateToken(tokenDescriprot);
                return tokenHandler.WriteToken(token);
            }
            catch(Exception ex)
            {
                _logger.LogError($"Ошибка при генерации AccessToken: {ex.Message}");
                throw;
            }
            
        }

        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }

        public async Task<string?> ValidateToken(string? token)
        {
            if (string.IsNullOrEmpty(token)) return null;

            var tokenHandler = new JwtSecurityTokenHandler();
            var accessTokenKey = Encoding.ASCII.GetBytes(_options.JwtAccessTokenKey);

            var validationResult = await tokenHandler.ValidateTokenAsync(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(accessTokenKey),
                ValidateIssuer = false,
                ValidateAudience = false
            });
            
            if(validationResult.IsValid)
            {
                return validationResult.Claims.First(c => c.Key == "id").Value.ToString();
            }
            return null;
        }
    }
}
