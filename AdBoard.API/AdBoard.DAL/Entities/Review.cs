using System;
using System.Collections.Generic;

namespace AdBoard.DAL.Entities;

public partial class Review
{
    public Guid Id { get; set; }

    public Guid? AnnouncementId { get; set; }

    public Guid? BuyerId { get; set; }

    public string? Description { get; set; }

    public int? Score { get; set; }

    public Guid? SellerId { get; set; }

    public virtual User? Buyer { get; set; }

    public virtual User? Seller { get; set; }
}
