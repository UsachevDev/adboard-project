using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace AdBoard.DAL.Entities;

public class User
{
    public Guid Id { get; set; }

    public string City { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public string Email { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string PhoneNumber { get; set; } = null!;

    public ICollection<Announcement>? Announcements { get; set; }
    public ICollection<Announcement> Favorites { get; set; } = new List<Announcement>();
    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();

    public ICollection<Review>? ReviewBuyers { get; set; }

    public ICollection<Review>? ReviewSellers { get; set; } 
}
