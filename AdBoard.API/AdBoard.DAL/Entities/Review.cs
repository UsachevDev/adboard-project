using System;
using System.Collections.Generic;

namespace AdBoard.DAL.Entities;

public class Review
{
    public Guid Id { get; set; }
    public Guid AnnouncementId { get; set; }
    public string? Description { get; set; }
    public int Score { get; set; }
    public Guid SellerId { get; set; }
    public Guid BuyerId { get; set; }
    public User Buyer { get; set; } = null!;
    public User Seller { get; set; } = null!;
    public Announcement Announcement { get; set; } = null!;
}
