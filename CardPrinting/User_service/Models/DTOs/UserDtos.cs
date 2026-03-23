using System.ComponentModel.DataAnnotations;

namespace User_Service.Models.DTOs
{
    public class UserDto
    {
        public int User_Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Username { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;
        
        public bool Is_premium { get; set; }
        
        public bool Is_admin { get; set; }
        
        public DateTime Created_at { get; set; }
        
        public DateTime? Updated_at { get; set; }
    }

    public class CreateUserDto
    {
        [Required]
        [StringLength(100, MinimumLength = 3)]
        public string Username { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string Password { get; set; } = string.Empty;
        
        public bool Is_premium { get; set; } = false;
        
        public bool Is_admin { get; set; } = false;
    }

    public class UpdateUserDto
    {
        [StringLength(100, MinimumLength = 3)]
        public string Username { get; set; } = string.Empty;
        
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;
        
        public bool? Is_premium { get; set; }
        
        public bool? Is_admin { get; set; }
    }

    public class ChangePasswordDto
    {
        [Required]
        public string CurrentPassword { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string NewPassword { get; set; } = string.Empty;
        
        [Compare("NewPassword", ErrorMessage = "The new password and confirmation password do not match.")]
        public string ConfirmNewPassword { get; set; } = string.Empty;
    }

    public class LoginDto
    {
        [Required]
        public string Username { get; set; } = string.Empty;
        
        [Required]
        public string Password { get; set; } = string.Empty;
    }
}
