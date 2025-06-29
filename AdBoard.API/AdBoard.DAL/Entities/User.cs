using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace AdBoard.DAL.Entities;

public partial class User
{
    public Guid Id { get; set; }

    public string? Address { get; set; }

    public DateTime? CreatedAt { get; set; }

    public string Email { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string? PhoneNumber { get; set; }

    public virtual ICollection<Announcement>? Announcements { get; set; }

    public virtual RefreshToken? RefreshToken { get; set; }

    public virtual ICollection<Review>? ReviewBuyers { get; set; }

    public virtual ICollection<Review>? ReviewSellers { get; set; } 
}
