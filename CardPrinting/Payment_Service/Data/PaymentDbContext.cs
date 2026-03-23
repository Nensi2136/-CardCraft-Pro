using Payment_Service.Models;
using Microsoft.EntityFrameworkCore;

namespace Payment_Service.Data
{
    public class PaymentDbContext : DbContext
    {
        public PaymentDbContext(DbContextOptions<PaymentDbContext> options) : base(options)
        {
        }

        public DbSet<Payment> Payments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Payment>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.AccountNumber).IsRequired();
                entity.Property(e => e.CVV).IsRequired();
                entity.Property(e => e.ExpiryDate).HasMaxLength(10).IsRequired();
                entity.Property(e => e.Amount).IsRequired();
                entity.Property(e => e.PaymentDate).IsRequired();

                // entity.HasOne(d => d.User)
                //       .WithMany()
                //       .HasForeignKey(d => d.UserId);
            });
        }
    }
}
