using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Text.Json.Serialization;

namespace AdBoard.API.Models.Responses
{
    public class ErrorResponse
    {
        public HttpStatusCode StatusCode { get; set; }
        public string Message { get; set; }
        public object? Errors { get; set; } = null;
    }
}
