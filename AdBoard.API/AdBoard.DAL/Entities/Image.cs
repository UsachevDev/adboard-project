using System;
using System.Collections.Generic;

namespace AdBoard.DAL.Entities;

public partial class Image
{
    public Guid Id { get; set; }

    public string FileName { get; set; } = null!;

    public string Url { get; set; } = null!;

    public Guid AnnouncementId { get; set; }

    public virtual Announcement Announcement { get; set; } = null!;
}
