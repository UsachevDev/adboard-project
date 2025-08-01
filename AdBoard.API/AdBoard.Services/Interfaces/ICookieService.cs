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
    public interface ICookieService
    {
        public void setRefreshToken(RefreshToken token, IResponseCookies cookies);
    }
}
