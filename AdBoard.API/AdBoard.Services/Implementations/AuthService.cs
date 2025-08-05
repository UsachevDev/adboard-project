using AdBoard.DAL;
using AdBoard.DAL.Entities;
using AdBoard.Services.Exceptions;
using AdBoard.Services.Interfaces;
using AdBoard.Services.Models.DTOs.Requests;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using AdBoard.Services.Models.Configurations;
using AdBoard.Services.Models.DTOs.Responses;
using System.Threading.Tasks;

namespace AdBoard.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly AdBoardDbContext _dbContext;
        private readonly IJwtService _jwtService;
        private readonly ILogger<IAuthService> _logger;
        private readonly SecurityOptions _securityOptions;
        public AuthService(
            AdBoardDbContext dbContext, 
            ILogger<IAuthService> logger, 
            IOptions<SecurityOptions> options,
            IJwtService jwtService
        )
        {
            _dbContext = dbContext;
            _logger = logger;
            _securityOptions = options.Value;
            _jwtService = jwtService;
        }
        public async Task<AuthResponseDto> Login(LoginDto dto)
        {     
            var user = await _dbContext.Users.Where(u => u.Email == dto.Email).Include(u => u.RefreshTokens).FirstOrDefaultAsync();
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
                throw new InvalidInputException("Неверный логин или пароль");

            try
            {
                var accessToken = _jwtService.GenerateAccessToken(user);
                var refreshToken = _jwtService.GenerateRefreshToken();

                var refreshTokenRecord = new RefreshToken
                {
                    UserId = user.Id,
                    Token = refreshToken,
                    ExpiryDate = DateTime.Now.AddDays(_securityOptions.JwtRefreshTokenDurationInDays)
                };
                user.RefreshTokens.Add(refreshTokenRecord);
                await _dbContext.SaveChangesAsync();
                return new AuthResponseDto(accessToken,refreshTokenRecord);
            }
            catch(Exception ex)
            {
                _logger.LogError($"При логине пользователя произошла ошибка: {ex.Message}");
                throw;
            }
        }

        public void Logout()
        {
            throw new NotImplementedException();
        }

        public void LogoutAll()
        {
            throw new NotImplementedException();
        }

        public async Task<AuthResponseDto> Refresh(string refreshToken)
        {
            try 
            {
                var refresh = await _dbContext.RefreshTokens.Include(u => u.User).FirstOrDefaultAsync(r => r.Token == refreshToken);
                if (refresh == null || refresh.IsRevoked)
                    throw new UnauthorizedException("Refresh Token недействителен. Пройдите аутентификацию");
                if(refresh.ExpiryDate <= DateTime.Now)
                {
                    _dbContext.RefreshTokens.Remove(refresh);
                    await _dbContext.SaveChangesAsync();
                    throw new UnauthorizedException("Refresh Token истек. Пройдите аутентификацию");
                }

                var newRefreshToken = _jwtService.GenerateRefreshToken();
                if (refresh.User == null)
                    throw new Exception($"Владелец токена не найден. TokenId: {refresh.Id}, UserId: {refresh.UserId}.");

                var accessToken = _jwtService.GenerateAccessToken(refresh.User);

                refresh.Token = newRefreshToken;
                refresh.ExpiryDate = DateTime.Now.AddDays(_securityOptions.JwtRefreshTokenDurationInDays);
                await _dbContext.SaveChangesAsync();
                return new AuthResponseDto(accessToken, refresh);
            }
            catch(UnauthorizedException)
            {
                throw;
            }
            catch(Exception ex)
            {
                _logger.LogError($"При обновлении токена произошла ошибка {ex.Message}");
                throw;
            }
        }

        public async Task<AuthResponseDto> Register(RegistrationDto dto)
        {
            try
            {
                var userCheck = await _dbContext.Users.AsNoTracking().FirstOrDefaultAsync(x => x.Email == dto.Email);
                if (userCheck != null)
                {
                    throw new RecordExistsException("Пользователь с таким Email уже существует");
                }
                User user = new User
                {
                    Id = Guid.NewGuid(),
                    Email = dto.Email,
                    Password = BCrypt.Net.BCrypt.HashPassword(dto.Password, _securityOptions.BCryptWorkFactor),
                    PhoneNumber = dto.PhoneNumber,
                    Name = dto.Name,
                    City = dto.City,
                    CreatedAt = DateTime.Now,
                };
                var accessToken = _jwtService.GenerateAccessToken(user);
                var refreshToken = _jwtService.GenerateRefreshToken();

                var refreshTokenRecord = new RefreshToken
                {
                    UserId = user.Id,
                    Token = refreshToken,
                    ExpiryDate = DateTime.Now.AddDays(_securityOptions.JwtRefreshTokenDurationInDays)
                };
                await _dbContext.Users.AddAsync(user);
                await _dbContext.RefreshTokens.AddAsync(refreshTokenRecord);
                await _dbContext.SaveChangesAsync();
                return new AuthResponseDto(accessToken, refreshTokenRecord, user.Id);
                
            }
            catch (RecordExistsException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError($"При регистрации пользователя с Email: {ex.Message}", ex.Message, dto.Email);
                throw;
            }

        }
    }
}
