using System;
using System.Collections.Generic;

namespace AdBoard.DAL.Entities;

public partial class Subcategory
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public Guid CategoryId { get; set; }

    public virtual ICollection<Announcement> Announcements { get; set; } = new List<Announcement>();

    public virtual Category Category { get; set; } = null!;
}
