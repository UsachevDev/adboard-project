using AdBoard.DAL.Entities;
using AdBoard.Services.Models.Configurations;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdBoard.Services.Interfaces
{
    public interface IHttpHeadersService
    {
        public void SetRefreshToken(RefreshToken token, IResponseCookies cookies);

        public void RevokeRefreshToken(IResponseCookies cookies);

        public string? GetRefreshToken(IRequestCookieCollection cookies);

    }
}
