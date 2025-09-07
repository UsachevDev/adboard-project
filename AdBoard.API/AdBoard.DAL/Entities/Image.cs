using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace AdBoard.DAL.Entities;

[Table(name: "images")]
public class Image
{
    public Guid Id { get; set; }

    public string FileName { get; set; } = null!;

    public string Url { get; set; } = null!;

    public Guid AnnouncementId { get; set; }

    public Announcement Announcement { get; set; } = null!;
}
