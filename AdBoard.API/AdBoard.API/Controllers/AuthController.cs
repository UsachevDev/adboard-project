using AdBoard.API.Models.Responses;
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
        private readonly ICookieService _cookieService;
        public AuthController(IAuthService authService, ICookieService cookieService)
        {
            _authService = authService;
            _cookieService = cookieService;
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
            _cookieService.setRefreshToken(registrationResult.RefreshToken, Response.Cookies);
            return Created(
                registrationResult.UserId.ToString(), 
                new SuccessResponse 
                { 
                    StatusCode = HttpStatusCode.Created,
                    Data = new {accessToken = registrationResult.AccessToken }
                }
            );
        }
    }
}
