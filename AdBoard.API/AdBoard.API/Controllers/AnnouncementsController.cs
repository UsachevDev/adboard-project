using AdBoard.API.Models.Responses;
using AdBoard.Services.Exceptions;
using AdBoard.Services.Interfaces;
using AdBoard.Services.Models.DTOs.Requests;
using AdBoard.Services.Models.RequestFilters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Security.Claims;

namespace AdBoard.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnnouncementsController : ControllerBase
    {
        private readonly IAnnouncementService _announcementService;
        public AnnouncementsController(IAnnouncementService announcementService)
        {
            _announcementService = announcementService;
        }
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Add([FromBody] AddAnnouncementDto dto)
        {
            var serviceResult = await _announcementService.AddAnnouncement(
                dto, 
                Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value));
            return Created(serviceResult.Id.ToString(), new SuccessResponse { StatusCode = HttpStatusCode.Created});
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            if (!Guid.TryParse(id, out var result))
                throw new InvalidInputException("ID объявления должен быть в формате UUID");

            var serviceResponse = await _announcementService.GetAnnouncementById(result);
            return Ok(new SuccessResponse { StatusCode = HttpStatusCode.OK, Data = serviceResponse});
        }
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] PageFilter? pageFilter)
        {

            var serviceResponse = await _announcementService.GetAnnouncements(pageFilter);
            return Ok(new SuccessResponse { StatusCode = HttpStatusCode.OK, Data = serviceResponse });
        }
    }
}
