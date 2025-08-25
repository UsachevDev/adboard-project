using AdBoard.DAL;
using AdBoard.DAL.Entities;
using AdBoard.Services.Exceptions;
using AdBoard.Services.Interfaces;
using AdBoard.Services.Models.DTOs.Requests;
using AdBoard.Services.Models.DTOs.Responses;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdBoard.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly AdBoardDbContext _dbContext;
        private readonly ILogger<IUserService> _logger;
        public UserService(AdBoardDbContext context, ILogger<IUserService> logger)
        {
            _dbContext = context;
            _logger = logger;
        }

        public FullUserInfo GetFullUserInfoById(Guid id)
        {
            try
            {
                FullUserInfo? user = _dbContext.Users
                    .AsNoTracking()
                    .Where(u => u.Id == id)
                    .Select(u => new FullUserInfo(
                        u.Id, 
                        u.Name, 
                        u.Email,
                        u.City,
                        u.PhoneNumber,
                        u.CreatedAt, 
                        u.Announcements,
                        u.ReviewBuyers,
                        u.ReviewSellers))
                    .FirstOrDefault();

                return user == null ? throw new NotFoundException($"Пользователь с id: {id} не найден") : user;
            }
            catch (NotFoundException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError($"При получении полных данных пользователя произошла ошибка {ex.Message}");
                throw;
            }
        }

        public UserInfoDto GetUserInfoById(Guid id)
        {
            try
            {
                UserInfoDto? user = _dbContext.Users
                    .AsNoTracking()
                    .Where(u => u.Id == id)
                    .Select(u => new UserInfoDto(u.Id, u.Name, u.CreatedAt, u.Announcements, u.ReviewBuyers))
                    .FirstOrDefault();

                return user ?? throw new NotFoundException($"Пользователь с id: {id} не найден");
            }
            catch (NotFoundException)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError($"При получении данных пользователя произошла ошибка {ex.Message}");
                throw;
            }
        }

        public async Task UpdateUser(UpdateUserInfoDto dto, Guid userId)
        {
            var user = _dbContext.Users.Where(u => u.Id == userId).FirstOrDefault();
            if (user == null)
            {
                throw new Exception("Авторизованный пользователь не найден в базе данных");
            }
            foreach (var property in typeof(UpdateUserInfoDto).GetProperties())
            {
                if(property.GetValue(dto) != null)
                {
                    var userProperty = typeof(User).GetProperty(property.Name);
                    if (userProperty != null)
                    {
                        userProperty.SetValue(user, property.GetValue(dto));
                    }
                }
            }

            await _dbContext.SaveChangesAsync();
            return;
        }
    }
}
