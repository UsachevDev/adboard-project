using NpgsqlTypes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace AdBoard.DAL.Entities;

public class Announcement
{
    public Guid Id { get; set; }

    public string? City { get; set; }

    public int? Count { get; set; }

    public Guid CreatorId { get; set; }

    public string Description { get; set; } = null!;

    public bool IsHidden { get; set; }

    public double Price { get; set; }

    public Guid? SubcategoryId { get; set; }

    public string Title { get; set; } = null!;

    public DateTime? CreatedAt { get; set; }
    [JsonIgnore]
    public NpgsqlTsVector SearchVector { get; set; } = null!;
    public User Creator { get; set; } = null!;
    public ICollection<Image> Images { get; set; } = new List<Image>();
    public ICollection<User> InFavorites { get; set; } = new List<User>();

    public Subcategory Subcategory { get; set; } = null!;
}
