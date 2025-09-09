using AdBoard.Services.Models.DTOs.Requests;
using AdBoard.Services.Models.DTOs.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdBoard.Services.Interfaces
{
    public interface IUserService
    {
        public UserInfoDto GetUserInfoById(Guid id);
        public FullUserInfo GetFullUserInfoById(Guid id);
        public Task UpdateUser(UpdateUserInfoDto dto, Guid userId);
    }
}
