using AdBoard.API.Configurations;
using AdBoard.API.Models.Responses;
using AdBoard.Services.Exceptions;
using AdBoard.Services.Interfaces;
using AdBoard.Services.Models.DTOs.Requests;
using AdBoard.Services.Models.RequestFilters;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.FileProviders;
using Supabase.Storage;
using System.Net;
using System.Security.Claims;

namespace AdBoard.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnnouncementsController : ControllerBase
    {
        private readonly IAnnouncementService _announcementService;
        private readonly string INCORRECT_ID_FORMAT_MESSAGE = "ID объявления должен быть в формате UUID";

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
                throw new InvalidInputException(INCORRECT_ID_FORMAT_MESSAGE);

            var serviceResponse = await _announcementService.GetAnnouncementById(result);
            return Ok(new SuccessResponse { StatusCode = HttpStatusCode.OK, Data = serviceResponse});
        }
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] PageFilter? pageFilter, [FromQuery] string? searchQuery)
        {

            var serviceResponse = await _announcementService.GetAnnouncements(pageFilter, searchQuery);
            return Ok(new SuccessResponse { StatusCode = HttpStatusCode.OK, Data = serviceResponse });
        }

        [Authorize]
        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateAnnouncement(string id, [FromBody] UpdateAnnouncementDto updateDto)
        {
            if (!Guid.TryParse(id, out var guidAnnouncementId))
                throw new InvalidInputException(INCORRECT_ID_FORMAT_MESSAGE);

            await _announcementService.UpdateAnnouncement(
                updateDto,
                Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value),
                guidAnnouncementId);

            return NoContent();
        }
        
        [Authorize]
        [HttpPost("{id}/favorites")]
        public async Task<IActionResult> AddToFavorites(string id)
        {
            if(!Guid.TryParse(id, out var guidAnnouncementId))
                throw new InvalidInputException("");

            await _announcementService.AddToFavorites(
                Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value),
                guidAnnouncementId);

            return NoContent();
        }
        [Authorize]
        [HttpDelete("{id}/favorites")]
        public async Task<IActionResult> RemoveFromFavorites(string id)
        {
            if (!Guid.TryParse(id, out var guidAnnouncementId))
                throw new InvalidInputException(INCORRECT_ID_FORMAT_MESSAGE);

            await _announcementService.RemoveFromFavorites(
                Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value),
                guidAnnouncementId);

            return NoContent();
        }
        [Authorize]
        [HttpPost("{id}/reviews")]
        public async Task<IActionResult> AddReview(string id, [FromBody] AddReviewDto reviewDto)
        {
            if (!Guid.TryParse(id, out var guidAnnouncementId))
                throw new InvalidInputException(INCORRECT_ID_FORMAT_MESSAGE);

            Guid userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            await _announcementService.AddReview(
                reviewDto,
                userId,
                guidAnnouncementId);

            return NoContent();
        }

        [Authorize]
        [HttpPost("{id}/images")]
        public async Task<IActionResult> UploadImages([FromForm]IFormFileCollection images, string id)
        {
            Guid userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            foreach(var image in images)
            {
                if (!CloudImageStorageConfiguration.AllowedTypes.Contains(image.ContentType.Split('/').Last()))
                    throw new InvalidInputException("Все фотографии должны быть формата: 'png', 'jpg, 'jpeg'");
            }
            if (!Guid.TryParse(id, out var guidAnnouncementId))
                throw new InvalidInputException(INCORRECT_ID_FORMAT_MESSAGE);
            await _announcementService.UploadImages(guidAnnouncementId, userId, images);
            return Created();
        }
    }
}
