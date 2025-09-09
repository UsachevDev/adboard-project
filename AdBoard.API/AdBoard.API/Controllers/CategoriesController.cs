using AdBoard.API.Models.Responses;
using AdBoard.Services.Exceptions;
using AdBoard.Services.Implementations;
using AdBoard.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace AdBoard.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            if (!Guid.TryParse(id, out var result))
                throw new InvalidInputException("ID категории должен быть в формате UUID");

            var serviceResponse = await _categoryService.GetCategoryById(result);
            return Ok(new SuccessResponse { StatusCode = HttpStatusCode.OK, Data = serviceResponse });
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var serviceResponse = await _categoryService.GetCategories();
            return Ok(new SuccessResponse { StatusCode = HttpStatusCode.OK, Data = serviceResponse });
        }
    }    
}
