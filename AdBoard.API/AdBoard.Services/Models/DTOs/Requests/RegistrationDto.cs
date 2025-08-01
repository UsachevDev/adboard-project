using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdBoard.Services.Models.DTOs.Requests
{
    public class RegistrationDto
    {
        public string Email { get; set; }
        public string Name { get; set; }
        public string Password { get; set; }
        public string PasswordConfirm { get; set; }
        public string PhoneNumber { get; set; }
        public string City { get; set; }

    }
}
