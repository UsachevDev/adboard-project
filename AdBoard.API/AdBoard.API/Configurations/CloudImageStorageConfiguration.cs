using Supabase;

namespace AdBoard.API.Configurations
{
    public static class CloudImageStorageConfiguration
    {
        public static readonly SupabaseOptions options = new SupabaseOptions()
        {
            AutoConnectRealtime = false
        };
        public static readonly IList<string> AllowedTypes = [".jpg", "jpeg","png"];
    }
}
