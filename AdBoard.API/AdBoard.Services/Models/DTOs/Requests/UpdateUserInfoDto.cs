using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdBoard.Services.Models.DTOs.Requests
{
    public record UpdateUserInfoDto(string? Name, string? Email, string? City, string? PhoneNumber);
}
