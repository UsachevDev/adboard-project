using System;
using System.Collections.Generic;

namespace AdBoard.DAL.Entities;

public class Subcategory
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public Guid CategoryId { get; set; }

    public ICollection<Announcement> Announcements { get; set; } = new List<Announcement>();
    public Category Category { get; set; } = null!;
}
