using AdBoard.DAL;
using AdBoard.DAL.Entities;
using AdBoard.Services.Exceptions;
using AdBoard.Services.Interfaces;
using AdBoard.Services.Models.DTOs.Requests;
using AdBoard.Services.Models.Extensions;
using AdBoard.Services.Models.RequestFilters;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace AdBoard.Services.Implementations
{
    public class AnnouncementService : IAnnouncementService
    {
        private readonly AdBoardDbContext _dbContext;
        private readonly ILogger _logger;
        public AnnouncementService(AdBoardDbContext dbContext, ILogger<IAnnouncementService> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task<Announcement> AddAnnouncement(AddAnnouncementDto addAnnouncementDto, Guid UserId)
        {
            string City = addAnnouncementDto.City ?? _dbContext.Users.Find(UserId)!.City;
            var subcategory = await _dbContext.Subcategories.FindAsync(addAnnouncementDto.SubcategoryId);
            if(subcategory == null) 
            {
                throw new ValidationException(
                    [new ValidationFailure("subcategoryId", "Подкатегории с таким id не существует")]
                );
            }
            Announcement announcement = new Announcement() 
            {
                Title = addAnnouncementDto.Title,
                Description = addAnnouncementDto.Description,
                City = City,
                Price = addAnnouncementDto.Price,
                Subcategory = subcategory,
                Count = addAnnouncementDto.Count,
                CreatorId = UserId,
                CreatedAt = DateTime.Now,
            };
            _dbContext.Announcements.Add(announcement);
            await _dbContext.SaveChangesAsync();
            return announcement;
        }

        public async Task<Announcement> GetAnnouncementById(Guid AnnouncementId)
        {
            try
            {
                var announcement = await _dbContext.Announcements
                    .Where(a => a.Id == AnnouncementId && !a.IsHidden)
                    .FirstOrDefaultAsync()
                    ?? throw new NotFoundException("Объявление с таким ID не найдено.");

                return announcement;
            }
            catch (NotFoundException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError($"При получении объявления с ID: {AnnouncementId} произошла ошибка: {ex.Message}");
                throw;
            }
        }

        public async Task<IEnumerable<Announcement>> GetAnnouncements(PageFilter? pageFilter)
        {
            return await _dbContext.Announcements
                .AsNoTracking()
                .Where(a => !a.IsHidden)
                .PageFilter(pageFilter)
                .ToListAsync();
        }
        public async Task UpdateAnnouncement(UpdateAnnouncementDto dto, Guid UserId, Guid AnnouncementId)
        {
            var announcement = _dbContext.Announcements.Find(AnnouncementId)
                ?? throw new NotFoundException("Объявление с таким ID не найдено");

            if (announcement.CreatorId != UserId)
                throw new ForbiddenException("Вы не автор объявления");


            foreach (var property in typeof(UpdateAnnouncementDto).GetProperties())
            {
                if (property.GetValue(dto) != null)
                {
                    var userProperty = typeof(Announcement).GetProperty(property.Name);
                    if (userProperty != null)
                    {
                        userProperty.SetValue(announcement, property.GetValue(dto));
                    }
                }
            }

            await _dbContext.SaveChangesAsync();
            return;
        }
    }
}
