using AdBoard.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdBoard.Services.Models.DTOs.Responses
{
    public record FullUserInfo(Guid id, string Name, string Email, string City, string PhoneNumber, DateTime CreatedAt, ICollection<Announcement>? Announcements, ICollection<Announcement>? Favorites, ICollection<Review>? BuyerReviews, ICollection<Review>? UserReviews);
}
