using AdBoard.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdBoard.Services.Models.DTOs.Responses
{
    public record UserInfoDto(
        Guid Id, 
        string Name, 
        DateTime CreatedAt, 
        IEnumerable<Announcement>? Announcements,
        IEnumerable<Review>? Reviews
    );
}
