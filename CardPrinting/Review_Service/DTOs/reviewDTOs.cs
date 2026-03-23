namespace Review_Service.DTOs
{
    public class ReviewDto
    {
        public int Review_Id { get; set; }
        public int User_Id { get; set; }
        public int Template_Id { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime Created_At { get; set; }
    }

    public class CreateReviewDto
    {
        public int User_Id { get; set; }
        public int Template_Id { get; set; }
        public int Rating { get; set; }
        public required string Comment { get; set; }
    }

    public class UpdateReviewDto
    {
        public int? User_Id { get; set; }
        public int? Template_Id { get; set; }
        public int? Rating { get; set; }
        public string? Comment { get; set; }
    }

    public class ContactUsDto
    {
        public int Contact_Id { get; set; }
        public int? User_Id { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Subject { get; set; }
        public string? Message { get; set; }
        public DateTime Created_at { get; set; }
    }

    public class CreateContactUsDto
    {
        public int? User_Id { get; set; }
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string Subject { get; set; }
        public required string Message { get; set; }
    }

    public class UpdateContactUsDto
    {
        public int? User_Id { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Subject { get; set; }
        public string? Message { get; set; }
    }
}
