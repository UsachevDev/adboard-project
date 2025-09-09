using AdBoard.Services.Models.DTOs.Requests;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdBoard.Services.Validators
{
    public class AnnouncementValidator : AbstractValidator<AddAnnouncementDto>
    {
        public AnnouncementValidator()
        {
            
        }
    }
}
