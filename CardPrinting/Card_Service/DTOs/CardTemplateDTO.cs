namespace Card_Service.DTOs
{
    public class CardTemplateDTO
    {
        public int Id { get; set; }
        public int CategoryId { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? FilePath { get; set; }
        public bool IsPremium { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}