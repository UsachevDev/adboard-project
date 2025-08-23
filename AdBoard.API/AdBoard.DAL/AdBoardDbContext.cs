using AdBoard.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace AdBoard.DAL
{
    public partial class AdBoardDbContext : DbContext
    {
        private readonly IConfiguration _configuration;
        public AdBoardDbContext(DbContextOptions<AdBoardDbContext> options, IConfiguration configuration) : base(options) 
        {
            _configuration = configuration;
            Database.EnsureCreated();
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
                optionsBuilder.UseNpgsql(_configuration.GetConnectionString("AdBoardDbConnection"));

        }

        public DbSet<Announcement> Announcements { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Image> Images { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Subcategory> Subcategories { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Announcement>(entity =>
            {
            entity.HasKey(e => e.Id).HasName("announcements_pkey");

            entity.ToTable("announcements");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.City)
                .HasMaxLength(255)
                .HasColumnName("city");
            entity.Property(e => e.Count).HasColumnName("count");
            entity.Property(e => e.CreatedAt)
                .HasColumnType("timestamp(6) without time zone")
                .HasColumnName("created_at");
            entity.Property(e => e.CreatorId).HasColumnName("creator_id");
            entity.Property(e => e.Description)
                .HasMaxLength(255)
                .HasColumnName("description");
            entity.Property(e => e.IsHidden).HasColumnName("is_hidden");
            entity.Property(e => e.Price).HasColumnName("price");
            entity.Property(e => e.SubcategoryId).HasColumnName("subcategory_id");
            entity.Property(e => e.Title)
                .HasMaxLength(255)
                .HasColumnName("title");

            entity.HasOne(d => d.Creator).WithMany(p => p.Announcements)
                .HasForeignKey(d => d.CreatorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk73q2bt9jjr30t9vagpj1v0d0f");

            entity.HasOne(d => d.Subcategory).WithMany(p => p.Announcements)
                .HasForeignKey(d => d.SubcategoryId)
                .HasConstraintName("fkhy8diliq1xh5bb3k9g0cnop30");

            entity.HasMany(u => u.InFavorites).WithMany(p => p.Favorites)
                .UsingEntity(j =>
                {
                    j.ToTable("favorites");

                    j.Property<Guid>("UserId").HasColumnName("user_id");
                    j.Property<Guid>("AnnouncementId").HasColumnName("announcement_id");
                });

            });

            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("categories_pkey");

                entity.ToTable("categories");

                entity.Property(e => e.Id)
                    .HasDefaultValueSql("gen_random_uuid()")
                    .HasColumnName("id");
                entity.Property(e => e.Name)
                    .HasMaxLength(255)
                    .HasColumnName("name");
            });

            modelBuilder.Entity<Image>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("images_pkey");

                entity.ToTable("images");

                entity.Property(e => e.Id)
                    .ValueGeneratedNever()
                    .HasColumnName("id");
                entity.Property(e => e.AnnouncementId).HasColumnName("announcement_id");
                entity.Property(e => e.FileName)
                    .HasMaxLength(255)
                    .HasColumnName("file_name");
                entity.Property(e => e.Url)
                    .HasMaxLength(255)
                    .HasColumnName("url");

                entity.HasOne(d => d.Announcement).WithMany(p => p.Images)
                    .HasForeignKey(d => d.AnnouncementId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("fk2e3fqhg3ymh1i6wb8yovu6ksi");
            });

            modelBuilder.Entity<RefreshToken>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("refresh_tokens_pkey");

                entity.ToTable("refresh_tokens");

                entity.HasIndex(e => e.UserId, "uk7tdcd6ab5wsgoudnvj7xf1b7l");

                entity.HasIndex(e => e.Token, "ukghpmfn23vmxfu3spu3lfg4r2d").IsUnique();

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.ExpiryDate)
                    .HasColumnType("timestamp(6) without time zone")
                    .HasColumnName("expiry_date");
                entity.Property(e => e.Token)
                    .HasMaxLength(255)
                    .HasColumnName("token");
                entity.Property(e => e.UserId).HasColumnName("user_id");
            });

            modelBuilder.Entity<Review>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("reviews_pkey");

                entity.ToTable("reviews");

                entity.Property(e => e.Id)
                    .ValueGeneratedNever()
                    .HasColumnName("id");
                entity.Property(e => e.AnnouncementId).HasColumnName("announcement_id");
                entity.Property(e => e.BuyerId).HasColumnName("buyer_id");
                entity.Property(e => e.Description)
                    .HasMaxLength(255)
                    .HasColumnName("description");
                entity.Property(e => e.Score).HasColumnName("score");
                entity.Property(e => e.SellerId).HasColumnName("seller_id");

                entity.HasOne(d => d.Buyer).WithMany(p => p.ReviewBuyers)
                    .HasForeignKey(d => d.BuyerId)
                    .HasConstraintName("fk2noibxu5e960l1c3wk929342s");

                entity.HasOne(d => d.Seller).WithMany(p => p.ReviewSellers)
                    .HasForeignKey(d => d.SellerId)
                    .HasConstraintName("fkouykkgwv4jl9590w2neamcktb");
            });

            modelBuilder.Entity<Subcategory>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("subcategories_pkey");

                entity.ToTable("subcategories");

                entity.Property(e => e.Id)
                    .HasDefaultValueSql("gen_random_uuid()")
                    .HasColumnName("id");
                entity.Property(e => e.CategoryId).HasColumnName("category_id");
                entity.Property(e => e.Name)
                    .HasMaxLength(255)
                    .HasColumnName("name");

                entity.HasOne(d => d.Category).WithMany(p => p.Subcategories)
                    .HasForeignKey(d => d.CategoryId)
                    .HasConstraintName("subcategories_category_id_fkey");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("users_pkey");

                entity.ToTable("users");

                entity.Property(e => e.Id)
                    .ValueGeneratedNever()
                    .HasColumnName("id");
                entity.Property(e => e.City)
                    .HasMaxLength(255)
                    .HasColumnName("address");
                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp(6) without time zone")
                    .HasColumnName("created_at");
                entity.Property(e => e.Email)
                    .HasMaxLength(255)
                    .HasColumnName("email");
                entity.Property(e => e.Name)
                    .HasMaxLength(255)
                    .HasColumnName("name");
                entity.Property(e => e.Password)
                    .HasMaxLength(255)
                    .HasColumnName("password");
                entity.Property(e => e.PhoneNumber)
                    .HasMaxLength(255)
                    .HasColumnName("phone_number");

            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
