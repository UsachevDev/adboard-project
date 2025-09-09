using Supabase;

namespace AdBoard.DAL
{
    public static class CloudImageStorageConfiguration
    {
        public static readonly string BUCKET_ANNOUNCEMENTS_IMAGES_NAME = "adboard-announcements-images";
        public static readonly IList<string> BUCKET_ANNOUNCEMENTS_IMAGES_ALLOWEDTYPES = [".jpg", "jpeg","png"];

        public static readonly SupabaseOptions Options = new SupabaseOptions()
        {
            AutoConnectRealtime = false
        };
    }
}
