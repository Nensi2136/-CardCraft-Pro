using Review_Service.Models;
using Microsoft.EntityFrameworkCore;

namespace Review_Service.Data
{
    public class ReviewDbContext : DbContext
    {
        public ReviewDbContext(DbContextOptions<ReviewDbContext> options) : base(options)
        {
        }

        public DbSet<Review> Reviews { get; set; }
        public DbSet<ContactUs> Contact_Us { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Review>(entity =>
            {
                entity.HasKey(e => e.Review_Id);
                entity.Property(e => e.Rating).IsRequired();
                entity.Property(e => e.Created_At).HasDefaultValueSql("CURRENT_TIMESTAMP");
                entity.ToTable(t => t.HasCheckConstraint("CK_Review_Rating", "rating BETWEEN 1 AND 5"));

                // entity.HasOne(d => d.User)
                //       .WithMany()
                //       .HasForeignKey(d => d.User_Id)
                //       .IsRequired();

                // entity.HasOne(d => d.Template)
                //       .WithMany()
                //       .HasForeignKey(d => d.Template_Id)
                //       .IsRequired();
            });

            modelBuilder.Entity<ContactUs>(entity =>
            {
                entity.HasKey(e => e.Contact_Id);
                entity.Property(e => e.Name).HasMaxLength(50).IsRequired();
                entity.Property(e => e.Email).HasMaxLength(80).IsRequired();
                entity.Property(e => e.Subject).HasMaxLength(200).IsRequired();
                entity.Property(e => e.Message).IsRequired();
                entity.Property(e => e.Created_at).IsRequired();

                // entity.HasOne(d => d.User)
                //       .WithMany()
                //       .HasForeignKey(d => d.User_Id)
                //       .IsRequired(false);
            });
        }
    }
}
