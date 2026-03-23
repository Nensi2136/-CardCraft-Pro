using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace User_service.Models
{
    public class Category
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Category_Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;

        public bool IsPremium { get; set; } = false;

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property for parent category (self-referencing relationship)
        public int? ParentCategoryId { get; set; }
        public virtual Category? ParentCategory { get; set; }

        // Navigation property for subcategories
        public virtual ICollection<Category>? SubCategories { get; set; }

        // You can add more properties as needed, for example:
        // public string ImageUrl { get; set; }
        // public int DisplayOrder { get; set; }
    }
}
