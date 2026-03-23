using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Card_Service.Models
{
    public class CardTemplate
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("Template_Id")]
        public int Id { get; set; }

        [Required]
        [Column("Category_Id")]
        public int CategoryId { get; set; }

        [MaxLength(100)]
        public string? Title { get; set; }

        [Column("Card_Template_Description")]
        [MaxLength(500)]
        public string? Description { get; set; }

        [Column("File_Path")]
        [MaxLength(500)]
        public string? FilePath { get; set; }

        [Column("Is_premium")]
        public bool IsPremium { get; set; }

        [Required]
        [Column("Created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        [Column("Updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        [ForeignKey("CategoryId")]
        public virtual TemplateCategory Category { get; set; } = null!;
    }
}
