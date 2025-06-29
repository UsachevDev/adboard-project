using AdBoard.DAL;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AdBoard.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : Controller
    {
        private readonly AdBoardDbContext _dbContext;
        public TestController(AdBoardDbContext context)
        {
            _dbContext = context;
        }

        /// <summary>
        ///     Тестовый GET метод
        /// </summary>
        /// <returns>Должен вернуть HELLO</returns>
        [HttpGet("users")]
        public IActionResult Index() => Ok(_dbContext.Users.AsNoTracking().ToList());

        /// <summary>
        ///     Тестовый GET c id
        /// </summary>
        /// <param name="id">Некий тестовый id</param>
        /// <returns>Переданный ID</returns>
        [HttpGet("{id}")]
        public string WithID(string id) => id;
    }
}
