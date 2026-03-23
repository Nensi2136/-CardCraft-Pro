using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Swashbuckle.AspNetCore.Annotations;

namespace Card_Service.Models.DTOs
{
    [SwaggerSchema(Description = "Data transfer object for creating a template category.")]
    public class CreateTemplateCategoryDto
    {
        [SwaggerSchema(Description = "The unique identifier for the category.", ReadOnly = true)]
        [JsonIgnore]
        public int Category_Id { get; set; }

        [Required(ErrorMessage = "Category name is required")]
        [MaxLength(100, ErrorMessage = "Category name cannot exceed 100 characters")]
        [SwaggerSchema(Description = "The name of the category.")]
        public string Category_Name { get; set; } = string.Empty;

        [MaxLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
        [SwaggerSchema(Description = "The description of the category.")]
        public string? Category_Description { get; set; }

        [SwaggerSchema(Description = "The date and time when the category was created.", ReadOnly = true)]
        [JsonIgnore]
        public DateTime Created_at { get; set; }

        [SwaggerSchema(Description = "The date and time when the category was last updated.", ReadOnly = true)]
        [JsonIgnore]
        public DateTime Updated_at { get; set; }
    }
}
