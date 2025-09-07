using AdBoard.DAL;
using AdBoard.DAL.Entities;
using AdBoard.Services.Exceptions;
using AdBoard.Services.Interfaces;
using AdBoard.Services.Models.DTOs.Requests;
using AdBoard.Services.Models.Extensions;
using AdBoard.Services.Models.RequestFilters;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace AdBoard.Services.Implementations
{
    public class AnnouncementService : IAnnouncementService
    {
        private readonly AdBoardDbContext _dbContext;
        private readonly Supabase.Client _supabaseClient;
        private readonly ILogger _logger;
        public AnnouncementService(AdBoardDbContext dbContext, Supabase.Client supabaseClient, ILogger<IAnnouncementService> logger)
        {
            _dbContext = dbContext;
            _supabaseClient = supabaseClient;
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

        public async Task AddReview(AddReviewDto dto, Guid UserId, Guid AnnouncementId)
        {
            var user = await _dbContext.Users
                .Where(u => u.Id == UserId)
                .Include(u => u.Favorites)
                .FirstOrDefaultAsync()
                    ?? throw new Exception("Пользователь не найден в БД, но был авторизован");

            var announcement = await _dbContext.Announcements.FindAsync(AnnouncementId)
                ?? throw new NotFoundException("Объявление с таким ID не найдено.");

            if (UserId == announcement.CreatorId)
                throw new ForbiddenException("Вы не можете добавить отзыв на свое объявление");

            var review = new Review
            {
                SellerId = announcement.CreatorId,
                BuyerId = UserId,
                Score = dto.Score,
                Description = dto.Description,
                Announcement = announcement,
            };
            await _dbContext.Reviews.AddAsync(review);
            await _dbContext.SaveChangesAsync();
            return;
        }

        public async  Task AddToFavorites(Guid UserId, Guid AnnouncementId)
        {
            var user = await _dbContext.Users
                .Where(u => u.Id == UserId)
                .Include(u => u.Favorites)
                .FirstOrDefaultAsync()
                    ?? throw new Exception("Пользователь не найден в БД, но был авторизован");

            var announcement = await _dbContext.Announcements.FindAsync(AnnouncementId)
                ?? throw new NotFoundException("Объявление с таким ID не найдено.");

            user.Favorites.Add(announcement);
            await _dbContext.SaveChangesAsync();
            return;
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

        public async Task<IEnumerable<Announcement>> GetAnnouncements(PageFilter? pageFilter, string? searchQuery)
        {
            IQueryable<Announcement> query = _dbContext.Announcements
                    .AsNoTracking();
            if (!string.IsNullOrEmpty(searchQuery))
                query = query.Where(a => a.SearchVector.Matches(EF.Functions.PhraseToTsQuery("russian",searchQuery)) && !a.IsHidden);
            else
                query = query.Where(a => !a.IsHidden);

            return await query.OrderByDescending(a => a.CreatedAt).PageFilter(pageFilter).ToListAsync();

        }

        public async Task RemoveFromFavorites(Guid UserId, Guid AnnouncementId)
        {
            var user = await _dbContext.Users
                .Where(u => u.Id == UserId)
                .Include(u => u.Favorites)
                .FirstOrDefaultAsync()
                    ?? throw new Exception("Пользователь не найден в БД, но был авторизован");

            var announcement = await _dbContext.Announcements.FindAsync(AnnouncementId)
                ?? throw new NotFoundException("Объявление с таким ID не найдено.");

            user.Favorites.Remove(announcement);
            await _dbContext.SaveChangesAsync();
            return;
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

        public async Task UploadImages(Guid announcementId, Guid userId, IFormFileCollection images)
        {
            var announcement = _dbContext.Announcements.Where(a => a.Id == announcementId).SingleOrDefault();
            if (announcement == null)
                throw new NotFoundException("Объявление с таким ID не найдено.");
            if (announcement.CreatorId != userId)
                throw new ForbiddenException("У вас нет доступа к редактированию этого объявления.");

            var bucket = _supabaseClient.Storage.From("adboard-announcements-images");
            var uploadedFileNames = new List<string>(images.Count);
            try
            {
                foreach (var image in images)
                {
                    var fileName = $"{announcementId}/{Guid.NewGuid().ToString()}.{image.ContentType.Split('/').Last()}";
                    using var stream = new MemoryStream();

                    await image.CopyToAsync(stream);
                    await bucket.Upload(stream.ToArray(), fileName);

                    uploadedFileNames.Add(fileName);

                    Image imageEntity = new Image()
                    {
                        AnnouncementId = announcementId,
                        FileName = fileName,
                        Url = bucket.GetPublicUrl(fileName)
                    };
                    announcement.Images.Add(imageEntity);
                }
                await _dbContext.SaveChangesAsync();
            }
            catch
            {
                foreach(var fileName in uploadedFileNames)
                {
                    await bucket.Remove(fileName);
                }
                throw;
            }
            

        }
    }
}
