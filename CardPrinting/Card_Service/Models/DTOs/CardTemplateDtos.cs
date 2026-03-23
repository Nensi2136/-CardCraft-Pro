using System.ComponentModel.DataAnnotations;

namespace Card_Service.Models.DTOs
{
    public class CardTemplateDto
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        public string TemplateData { get; set; } = string.Empty;
        
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? FilePath { get; internal set; }
        public bool IsPremium { get; internal set; }
        public string? Title { get; internal set; }
    }

    public class CreateCardTemplateDto
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        public string TemplateData { get; set; } = string.Empty;
        
        [Required]
        public int CategoryId { get; set; }
        
        public bool IsPremium { get; set; }
    }

    public class UpdateCardTemplateDto
    {
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [StringLength(500)]
        public string Description { get; set; } = string.Empty;
        
        public string TemplateData { get; set; } = string.Empty;
        
        public int? CategoryId { get; set; }
        
        public bool IsPremium { get; set; }
    }
}
