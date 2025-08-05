using AdBoard.API.Models.Responses;
using AdBoard.Services.Exceptions;
using AdBoard.Services.Interfaces;
using AdBoard.Services.Models.DTOs.Requests;
using AdBoard.Services.Models.DTOs.Responses;
using FluentValidation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;

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
                throw new UnauthorizedException("Отсутствует RefreshToken, пройдите аутентификацию");
            }

            AuthResponseDto authResponseDto = await _authService.Refresh(refreshToken);
            _headersService.SetRefreshToken(authResponseDto.RefreshToken, Response.Cookies);
            return Ok(new SuccessResponse
            {
                StatusCode = HttpStatusCode.OK,
                Data = new { accessToken = authResponseDto.AccessToken }
            });
        }
    }
}
