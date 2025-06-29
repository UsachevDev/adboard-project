using System;
using System.Collections.Generic;

namespace AdBoard.DAL.Entities;

public partial class RefreshToken
{
    public long Id { get; set; }

    public DateTime? ExpiryDate { get; set; }

    public string Token { get; set; } = null!;

    public Guid? UserId { get; set; }

    public virtual User? User { get; set; }
}
