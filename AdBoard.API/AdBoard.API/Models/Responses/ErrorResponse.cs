using System.ComponentModel.DataAnnotations;
using System.Net;

namespace AdBoard.API.Models.Responses
{
    public class ErrorResponse
    {
        public HttpStatusCode StatusCode { get; set; }
        public string Message { get; set; }
        public object? Errors { get; set; }
    }
}
