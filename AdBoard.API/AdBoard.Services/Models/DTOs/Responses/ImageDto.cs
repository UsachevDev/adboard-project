using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdBoard.Services.Models.DTOs.Responses
{
    public class ImageDto
    {
        public string FileName { get; set; } = null!;
        public string Url { get; set; } = null!;
    }
}
