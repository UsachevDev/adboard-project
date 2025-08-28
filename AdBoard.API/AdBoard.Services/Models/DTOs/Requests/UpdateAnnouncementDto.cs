using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdBoard.Services.Models.DTOs.Requests
{
    public record UpdateAnnouncementDto(string? Title, string? Description, double? Price, string? City, int? Count, bool? IsHidden);
}
