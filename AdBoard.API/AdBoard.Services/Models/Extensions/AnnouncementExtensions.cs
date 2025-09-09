using AdBoard.DAL.Entities;
using AdBoard.Services.Models.RequestFilters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdBoard.Services.Models.Extensions
{
    public static class AnnouncementExtensions
    {
        public static IQueryable<Announcement> PageFilter(this IQueryable<Announcement> query, PageFilter? filter)
        {
            int page = filter?.Page ?? 1;
            int pageSize = filter?.PageSize ?? 15;
            int skipSize = (page-1) * pageSize;

            return query.Skip(skipSize).Take(pageSize);
        }
    }
}
