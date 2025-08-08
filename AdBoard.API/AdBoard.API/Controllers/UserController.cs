using AdBoard.Services.Exceptions;
using AdBoard.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AdBoard.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IHttpHeadersService _httpHeaderService;
        public UsersController(IUserService userService, IHttpHeadersService httpHeadersService)
        {
            _userService = userService;
            _httpHeaderService = httpHeadersService;
        }

        private Guid ParseToGuid(string id)
        {
            bool isParseSuccessful = Guid.TryParse(id, out Guid guidId);
            if (!isParseSuccessful)
                throw new InvalidInputException("Некорректный формат id пользователя");
            return guidId;
        }

        [HttpGet("{id}")]
        public IActionResult GetUserInfo(string id)
        {
            var guidId = ParseToGuid(id);
            var userInfo = _userService.GetUserInfoById(guidId);
            return Ok(userInfo);
        }
        [Authorize]
        [HttpGet("profile")]
        public IActionResult GetFullUserInfo()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var guidId = ParseToGuid(userId);
            var userInfo = _userService.GetFullUserInfoById(guidId);
            return Ok(userInfo);
        }

        public async Task<IActionResult> Update()
    }
}
