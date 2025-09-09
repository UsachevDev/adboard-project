using AdBoard.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdBoard.Services.Interfaces
{
    public interface IJwtService
    {
        public string GenerateAccessToken(User user);
        public string GenerateRefreshToken();
        public Task<string?> ValidateToken(string? token);
    }
}
