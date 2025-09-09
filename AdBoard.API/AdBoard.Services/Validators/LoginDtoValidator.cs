using AdBoard.Services.Models.DTOs.Requests;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdBoard.Services.Validators
{
    public class LoginDtoValidator : AbstractValidator<LoginDto>
    {
        public LoginDtoValidator()
        {
            RuleFor(u => u.Email)
                .NotNull().WithMessage("Поле 'Email' обязателено")
                .EmailAddress().WithMessage("Некорретный email");
            RuleFor(u => u.Password)
                .NotNull().WithMessage("Поле 'Пароль' обязательно")
                .MinimumLength(8).WithMessage("Пароль должен быть длинной не менее 8 символов");
        }
    }
}
