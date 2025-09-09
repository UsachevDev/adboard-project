using AdBoard.DAL.Entities;
using AdBoard.Services.Models.DTOs.Requests;
using AdBoard.Services.Models.DTOs.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdBoard.Services.Interfaces
{
    public interface IAuthService
    {
        public Task<AuthResponseDto> Register(RegistrationDto dto);
        public Task<AuthResponseDto> Login(LoginDto dto);
        public Task<AuthResponseDto> Refresh(string refreshToken);
        public Task Logout(string refreshToken);

        public Task LogoutAll(string userId);
    }
}
