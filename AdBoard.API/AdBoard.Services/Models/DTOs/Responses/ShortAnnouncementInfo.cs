using AdBoard.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdBoard.Services.Models.DTOs.Responses
{
    public class ShortAnnouncementInfo
    {
        public Guid id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int? Count { get; set; }
        public double Price { get; set; }
        public string City { get; set; }
        public DateTime? CreatedAt { get; set; }
        public Subcategory Subcategory { get; set; }
        public ImageDto Image { get; set; }
    }
}
