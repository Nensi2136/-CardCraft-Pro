using System.ComponentModel.DataAnnotations;

namespace Payment_Service.Models
{
    public class PaymentMethod
    {
        [Key]
        public int Id { get; set; }
        
        public int UserId { get; set; }
        
        public string? CardType { get; set; }
        
        public string? MaskedDetails { get; set; }
        
        public bool IsDefault { get; set; }
        
        public DateTime CreatedAt { get; set; }
    }
}
