namespace AdBoard.Services.Models.Configurations
{
    public class SecurityOptions
    {
        public string JwtAccessTokenKey { get; set; } = "";
        public int JwtAccessTokenDurationInMinutes { get; set; }
        public int JwtRefreshTokenDurationInDays{ get; set; }

    }
}
