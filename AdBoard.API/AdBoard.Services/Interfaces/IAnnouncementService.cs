using AdBoard.DAL.Entities;
using AdBoard.Services.Models.DTOs.Requests;
using AdBoard.Services.Models.RequestFilters;
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
        public Task<IEnumerable<Announcement>> GetAnnouncements(PageFilter? pageFilter);
        public Task UpdateAnnouncement(UpdateAnnouncementDto dto, Guid UserId, Guid AnnouncementId);
    }
}
