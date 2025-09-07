using AdBoard.DAL.Entities;
using AdBoard.Services.Models.DTOs.Requests;
using AdBoard.Services.Models.DTOs.Responses;
using AdBoard.Services.Models.RequestFilters;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdBoard.Services.Interfaces
{
    public interface IAnnouncementService
    {
        public Task<Announcement> AddAnnouncement(AddAnnouncementDto addAnnouncement, Guid UserId);
        public Task<Announcement> GetAnnouncementById(Guid AnnouncementId);
        public Task<IEnumerable<ShortAnnouncementInfo>> GetAnnouncements(PageFilter? pageFilter, string? searchQuery);
        public Task UploadImages(Guid announcementId, Guid userId, IFormFileCollection images);
        public Task UpdateAnnouncement(UpdateAnnouncementDto dto, Guid UserId, Guid AnnouncementId);
        public Task AddToFavorites(Guid UserId, Guid AnnouncementId);
        public Task AddReview(AddReviewDto dto, Guid UserId, Guid AnnouncementId);
        public Task RemoveFromFavorites(Guid UserId, Guid AnnouncementId);
    }
}
