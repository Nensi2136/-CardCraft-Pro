using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace User_Service.Models
{
    public class UserDetail
    {
        [Key]
        public int User_Id { get; set; }
        public required string Username { get; set; }
        public required string Email { get; set; }
        public required string Password_hash { get; set; }
        public bool Is_premium { get; set; }
        public bool Is_admin { get; set; }
        public DateTime Created_at { get; set; }
        public DateTime? Updated_at { get; set; }
        
        // These properties seem redundant but keeping them to avoid breaking changes for now
        // if they are used elsewhere.
        [NotMapped]
        public string PasswordHash { get; internal set; } = string.Empty;
        [NotMapped]
        public bool IsActive { get; internal set; }
        [NotMapped]
        public DateTime CreatedAt { get; internal set; }
    }
}
