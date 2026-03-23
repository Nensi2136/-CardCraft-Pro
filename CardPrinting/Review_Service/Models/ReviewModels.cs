namespace Review_Service.Models
{
    public class Review
    {
        public int Review_Id { get; set; }
        public int User_Id { get; set; }
        public int Template_Id { get; set; }
        public int Rating { get; set; }
        public required string Comment { get; set; }
        public DateTime Created_At { get; set; }
    }

    public class ContactUs
    {
        public int Contact_Id { get; set; }
        public int? User_Id { get; set; }
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string Subject { get; set; }
        public required string Message { get; set; }
        public DateTime Created_at { get; set; }
    }
}
