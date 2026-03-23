using System.ComponentModel.DataAnnotations;

namespace Payment_Service.Models
{
    public class Payment
    {
        [Key]
        public int Id { get; set; }
        
        public int UserId { get; set; }
        
        public long AccountNumber { get; set; }
        
        public long CVV { get; set; }
        
        public required string ExpiryDate { get; set; }
        
        public float Amount { get; set; }
        
        public DateTime PaymentDate { get; set; }
        
        public string? Status { get; set; }
        
        public DateTime? ProcessedDate { get; set; }
        
        public string? TransactionId { get; set; }
    }
}
