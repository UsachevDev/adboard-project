using System;
using System.Collections.Generic;

namespace AdBoard.DAL.Entities;

public class Image
{
    public Guid Id { get; set; }

    public string FileName { get; set; } = null!;

    public string Url { get; set; } = null!;

    public Guid AnnouncementId { get; set; }

    public Announcement Announcement { get; set; } = null!;
}
