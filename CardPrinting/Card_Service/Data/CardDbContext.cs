using Card_Service.Models;
using Microsoft.EntityFrameworkCore;

namespace Card_Service.Data
{
    public class CardDbContext : DbContext
    {
        public CardDbContext(DbContextOptions<CardDbContext> options) : base(options)
        {
        }

        public DbSet<TemplateCategory> Template_Categories { get; set; }
        public DbSet<CardTemplate> Card_Templates { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TemplateCategory>(entity =>
            {
                entity.HasKey(e => e.Category_Id);
                entity.Property(e => e.Name).HasMaxLength(60).IsRequired();
                entity.HasIndex(e => e.Name).IsUnique();
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.HasMany(e => e.CardTemplates)
                      .WithOne(c => c.Category)
                      .HasForeignKey(c => c.CategoryId);
            });

            modelBuilder.Entity<CardTemplate>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).HasMaxLength(50).IsRequired();
                entity.Property(e => e.IsPremium).HasDefaultValue(false);
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });
        }
    }
}
