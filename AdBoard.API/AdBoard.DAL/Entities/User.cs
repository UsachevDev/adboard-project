using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace AdBoard.DAL.Entities;

public class User
{
    public Guid Id { get; set; }

    public string City { get; set; }

    public DateTime CreatedAt { get; set; }

    public string Email { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string PhoneNumber { get; set; } = null!;

    public ICollection<Announcement>? Announcements { get; set; }

    public RefreshToken? RefreshToken { get; set; }

    public ICollection<Review>? ReviewBuyers { get; set; }

    public ICollection<Review>? ReviewSellers { get; set; } 
}
