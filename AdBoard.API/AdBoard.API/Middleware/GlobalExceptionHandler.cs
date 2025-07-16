using AdBoard.API.Models.Responses;
using FluentValidation;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Net;
using ValidationException = FluentValidation.ValidationException;

namespace AdBoard.API.Middleware
{
    public class GlobalExceptionHandler
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionHandler> _logger;

        public GlobalExceptionHandler(RequestDelegate next, ILogger<GlobalExceptionHandler> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        public Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var result = new ErrorResponse
            {
                StatusCode = HttpStatusCode.InternalServerError,
                Message = "Unhandled server error"
            };

            switch (exception)
            {
                case ValidationException validationException:
                {
                    result.StatusCode = HttpStatusCode.BadRequest;
                    result.Message = "Ошибка валидации";
                    result.Errors = validationException.Errors?.Select(e => new
                    {
                        Property = e.PropertyName,
                        Error = e.ErrorMessage
                    });
                    break;
                }
            }

            context.Response.StatusCode = (int)result.StatusCode;
            return context.Response.WriteAsJsonAsync(result);
        }
    }
}
