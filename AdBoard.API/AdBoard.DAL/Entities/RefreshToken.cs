using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace AdBoard.DAL.Entities;

[Table("refresh_tokens")]
public class RefreshToken
{
    public long Id { get; set; }

    public DateTime ExpiryDate { get; set; }

    public string Token { get; set; } = null!;

    public bool IsRevoked { get; set; }

    public Guid UserId { get; set; }

    public User? User { get; set; }
}
