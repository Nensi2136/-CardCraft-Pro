using System.ComponentModel.DataAnnotations;

namespace Payment_Service.Models.DTOs
{
    public class PaymentMethodDto
    {
        public int Id { get; set; }
        
        [Required]
        public int UserId { get; set; }
        
        [Required]
        public string Type { get; set; } = string.Empty;  // CreditCard, BankAccount, PayPal, etc.
        
        [Required]
        public string DisplayName { get; set; } = string.Empty;
        
        public bool IsDefault { get; set; }
        
        public bool IsActive { get; set; }
        
        // Masked/partial details for security
        public string MaskedDetails { get; set; } = string.Empty;
    }

    public class CreatePaymentMethodDto
    {
        [Required]
        public string Type { get; set; } = string.Empty;
        
        [Required]
        public string DisplayName { get; set; } = string.Empty;
        
        // Full payment method details (will be encrypted/handled securely)
        public object? PaymentDetails { get; set; }
        
        public bool SetAsDefault { get; set; }
    }

    public class UpdatePaymentMethodDto
    {
        public string DisplayName { get; set; } = string.Empty;
        public bool? IsDefault { get; set; }
        public bool? IsActive { get; set; }
    }
}
