using AdBoard.DAL.Entities;
using AdBoard.Services.Interfaces;
using AdBoard.Services.Models.Configurations;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace AdBoard.Services.Implementations
{
    public class HttpHeadersService : IHttpHeadersService
    {
        private readonly ILogger logger;
        private readonly SecurityOptions securityOptions;
        public HttpHeadersService(ILogger<IHttpHeadersService> logger, IOptions<SecurityOptions> options)
        {
            this.logger = logger;
            securityOptions = options.Value;
        }

        public string getRefreshToken(IResponseCookies cookies)
        {
            throw new NotImplementedException();
        }

        public void setRefreshToken(RefreshToken token, IResponseCookies cookies)
        {
            try
            {
                Cookie cookie = new Cookie
                {
                    Name = securityOptions.AuthHttpOnlyCookieName,
                    Value = token.Token,
                    Expires = token.ExpiryDate,
                    HttpOnly = true
                };
                cookies.Append(cookie.Name, cookie.Value, new CookieOptions { Expires = cookie.Expires, HttpOnly = true });
            }
            catch(Exception ex)
            {
                logger.LogError($"При добавлении refresh токена в Cookies произошла ошибка: {ex.Message}");
                throw;
            }
        }
    }
}
