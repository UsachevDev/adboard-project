using System.Net;

namespace AdBoard.API.Models.Responses
{
    public class SuccessResponse
    {
        public HttpStatusCode StatusCode { get; set; }
        public object? Data { get; set; }
    }
}
