using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AdBoard.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestContoller : Controller
    {
        /// <summary>
        ///     Тестовый GET метод
        /// </summary>
        /// <returns>Должен вернуть HELLO</returns>
        [HttpGet]
        public string Index() => "HELLO";

        /// <summary>
        ///     Тестовый GET c id
        /// </summary>
        /// <param name="id">Некий тестовый id</param>
        /// <returns>Переданный ID</returns>
        [HttpGet("{id}")]
        public string WithID(string id) => id;
    }
}
