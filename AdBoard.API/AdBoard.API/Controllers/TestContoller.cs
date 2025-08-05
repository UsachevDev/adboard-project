using AdBoard.DAL;
using AdBoard.Services.Implementations;
using AdBoard.Services.Interfaces;
using AdBoard.Services.Models.Configurations;
using AdBoard.Services.Models.DTOs.Requests;
using AdBoard.Services.Validators;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Security.Claims;

namespace AdBoard.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : Controller
    {
        private readonly AdBoardDbContext _dbContext;
        private readonly IJwtService _jwtService;
        private readonly IValidator<RegistrationDto> _valiValidator;
        private readonly SecurityOptions _options;
        public TestController(AdBoardDbContext context, IOptions<SecurityOptions> options, IJwtService jwtService, IValidator<RegistrationDto> validator, IAuthService authService)
        {
            _dbContext = context;
            _options = options.Value;
            _jwtService = jwtService;
            _valiValidator = validator;
        }

        /// <summary>
        ///     Тестовый GET метод
        /// </summary>
        /// <returns>Должен вернуть HELLO</returns>
        [HttpGet("users")]
        public IActionResult Index() => Ok(_dbContext.Users.AsNoTracking().Include(u => u.Announcements).ToList());

        /// <summary>
        ///     Тестовый GET c id
        /// </summary>
        /// <param name="id">Некий тестовый id</param>
        /// <returns>Переданный ID</returns>
        [HttpGet("{id}")]
        public string WithID(string id) => id;

        [HttpGet("items")]
        public string Items() => HttpContext.Items["User"]?.ToString();

        [HttpGet("exception")]
        public string Exception() => throw new HttpRequestException();

        [HttpGet("env")]
        public string EnvTest() => _options.JwtAccessTokenKey;

        [HttpPost("login/{id}")]
        public IActionResult Login(string id)
        {
            Response.ContentType = "application/json";
            var user = _dbContext.Users.Find(Guid.Parse(id));
            var genAccessToken = _jwtService.GenerateAccessToken(user);
            return Ok(genAccessToken);
        }
        [HttpPost("registration")]
        public IActionResult Registration([FromBody] RegistrationDto dto)
        {
            var validatorResult = _valiValidator.Validate(dto);
            if (!validatorResult.IsValid)
            {
                throw new ValidationException(validatorResult.Errors);
            }

            return Ok(dto);
        }

        [Authorize]
        [HttpGet("secured")]
        public string Security() => User.FindFirst(ClaimTypes.NameIdentifier).Value;
    }
}
