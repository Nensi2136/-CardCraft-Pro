using System.Text.Json.Serialization;

namespace Card_Service.Models.DTOs
{
    public class TemplateCategoryResponseDto
    {
        [JsonPropertyName("category_Id")]
        public int CategoryId { get; set; }

        [JsonPropertyName("category_Name")]
        public string CategoryName { get; set; } = string.Empty;

        [JsonPropertyName("category_Description")]
        public string? CategoryDescription { get; set; }

        [JsonPropertyName("created_at")]
        public DateTime CreatedAt { get; set; }

        [JsonPropertyName("updated_at")]
        public DateTime UpdatedAt { get; set; }
    }
}
