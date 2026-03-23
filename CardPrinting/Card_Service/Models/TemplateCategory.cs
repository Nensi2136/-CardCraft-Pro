using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Card_Service.Models
{
    public class TemplateCategory
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Category_Id { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("Category_Name")]
        public string Name { get; set; } = string.Empty;

        [MaxLength(500)]
        [Column("Category_Description")]
        public string? Description { get; set; }

        [Required]
        [Column("Created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        [Column("Updated_at")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public virtual ICollection<CardTemplate> CardTemplates { get; set; } = new List<CardTemplate>();
    }
}
