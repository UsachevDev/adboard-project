using AdBoard.API.Models.Responses;
using AdBoard.DAL.Entities;
using AdBoard.Services.Exceptions;
using AdBoard.Services.Interfaces;
using AdBoard.Services.Models.DTOs.Requests;
using AdBoard.Services.Models.DTOs.Responses;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Security.Claims;

namespace AdBoard.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IHttpHeadersService _headersService;

        public AuthController(IAuthService authService, IHttpHeadersService cookieService)
        {
            _authService = authService;
            _headersService = cookieService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(
            [FromBody] RegistrationDto dto,
            [FromServices] IValidator<RegistrationDto> validator
        )
        {
            var validationResult = validator.Validate(dto);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }
            AuthResponseDto registrationResult = await _authService.Register(dto);
            _headersService.SetRefreshToken(registrationResult.RefreshToken, Response.Cookies);
            return Created(
                registrationResult.UserId.ToString(), 
                new SuccessResponse
                {
                    StatusCode = HttpStatusCode.Created,
                    Data = new { accessToken = registrationResult.AccessToken }
                }
            );
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(
            [FromBody] LoginDto dto,
            [FromServices] IValidator<LoginDto> validator
        )
        {
            var validationResult = validator.Validate(dto);
            if (!validationResult.IsValid)
            {
                throw new ValidationException(validationResult.Errors);
            }
            AuthResponseDto authResponseDto = await _authService.Login(dto);
            _headersService.SetRefreshToken(authResponseDto.RefreshToken, Response.Cookies);
            return Ok(new SuccessResponse
            {
                StatusCode = HttpStatusCode.OK,
                Data = new { accessToken = authResponseDto.AccessToken }
            });
        }
        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh()
        {
            var refreshToken = _headersService.GetRefreshToken(Request.Cookies);
            if(string.IsNullOrEmpty(refreshToken))
            {
                throw new UnauthorizedException("RefreshToken отсутствует или истек");
            }

            AuthResponseDto authResponseDto = await _authService.Refresh(refreshToken);
            _headersService.SetRefreshToken(authResponseDto.RefreshToken, Response.Cookies);
            return Ok(new SuccessResponse
            {
                StatusCode = HttpStatusCode.OK,
                Data = new { accessToken = authResponseDto.AccessToken }
            });
        }
        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var refreshToken = _headersService.GetRefreshToken(Request.Cookies);
            if (string.IsNullOrEmpty(refreshToken))
            {
                throw new UnauthorizedException("Отсутствует RefreshToken");
            }

            await _authService.Logout(refreshToken);
            _headersService.RevokeRefreshToken(Response.Cookies);
            return Ok(new SuccessResponse { StatusCode = HttpStatusCode.OK });
        }

        [Authorize]
        [HttpPost("logout-all")]
        public async Task<IActionResult> LogoutAll()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                throw new UnauthorizedException("Ошибка авторизации");
            }
            await _authService.LogoutAll(userId);
            return Ok(new SuccessResponse { StatusCode = HttpStatusCode.OK });
        }
    }
}
