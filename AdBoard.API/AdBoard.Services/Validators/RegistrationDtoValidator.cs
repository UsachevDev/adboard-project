using AdBoard.Services.Models.DTOs.Requests;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdBoard.Services.Validators
{
    public class RegistrationDtoValidator : AbstractValidator<RegistrationDto>
    {
        public RegistrationDtoValidator()
        {
            RuleFor(x => x.Email)
                .NotNull().WithMessage("Поле 'Email' обязательно")
                .EmailAddress().WithMessage("Некорретный email");

            RuleFor(x => x.PasswordConfirm)
                .Equal(x => x.Password).WithMessage("Пароли должны совпадать");

            RuleFor(x => x.Password)
                .NotNull().WithMessage("Поле 'Пароль' обязательно")
                .MinimumLength(8).WithMessage("Пароль должен быть длинной не менее 8 символов");

            RuleFor(x => x.PhoneNumber)
                .NotNull().WithMessage("Поле 'Номер телефона' обязательно")
                .Matches(@"^\+?\d+$").WithMessage("Номер телефона должен содержать только цифры с необязательным '+' в начале");

            RuleFor(x => x.City)
                .NotNull().WithMessage("Поле 'Город' обязательно")
                .Matches(@"^[^\d]+$").WithMessage("Название города не должно содержать цифр");
        }
    }
}
