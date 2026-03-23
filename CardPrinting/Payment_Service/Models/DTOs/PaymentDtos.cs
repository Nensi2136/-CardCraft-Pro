using System;
using System.ComponentModel.DataAnnotations;

namespace Payment_Service.Models.DTOs
{
    public class PaymentDto
    {
        public int Id { get; set; }
        
        [Required]
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

    public class CreatePaymentDto
    {
        [Required]
        public int UserId { get; set; }
        
        [Required]
        public long AccountNumber { get; set; }
        
        [Required]
        public long CVV { get; set; }
        
        [Required]
        public string ExpiryDate { get; set; } = string.Empty;
        
        [Required]
        [Range(0.01, float.MaxValue)]
        public float Amount { get; set; }
    }

    public class UpdatePaymentStatusDto
    {
        [Required]
        public string Status { get; set; } = string.Empty;
        
        public string TransactionId { get; set; } = string.Empty;
    }
}
