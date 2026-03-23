using User_Service.Models;
using Microsoft.EntityFrameworkCore;

namespace User_Service.Data
{
    public class UserDbContext : DbContext
    {
        public UserDbContext(DbContextOptions<UserDbContext> options) : base(options)
        {
        }

        public DbSet<UserDetail> User_Details { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserDetail>(entity =>
            {
                entity.HasKey(e => e.User_Id);
                entity.Property(e => e.Username).HasMaxLength(10).IsRequired();
                entity.HasIndex(e => e.Username).IsUnique();
                entity.Property(e => e.Email).HasMaxLength(50).IsRequired();
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Password_hash).HasMaxLength(60).IsRequired();
                entity.HasIndex(e => e.Password_hash).IsUnique();
                entity.Property(e => e.Is_premium).HasDefaultValue(false);
                entity.Property(e => e.Is_admin).HasDefaultValue(false);
                entity.Property(e => e.Created_at).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });
        }
    }
}
