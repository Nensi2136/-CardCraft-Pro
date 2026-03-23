using User_Service.Models.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace User_Service.Services.Interfaces
{
    public interface IUserService
    {
        Task<IEnumerable<UserDto>> GetAllUsersAsync();
        Task<UserDto> GetUserByIdAsync(int id);
        Task<UserDto> CreateUserAsync(CreateUserDto createDto);
        Task UpdateUserAsync(int id, UpdateUserDto updateDto);
        Task DeleteUserAsync(int id);
        Task<bool> UserExistsAsync(int id);
        Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto changePasswordDto);
        Task<bool> ValidateUserCredentialsAsync(string username, string password);
        
        // New methods for enhanced functionality
        Task<UserDto> AuthenticateUserAsync(string username, string password);
        Task UpgradeToPremiumAsync(int id);
        Task ToggleAdminStatusAsync(int id);
        Task<UserDto> GetUserByEmailAsync(string email);
        Task<IEnumerable<UserDto>> GetPremiumUsersAsync();
        Task<IEnumerable<UserDto>> GetAdminUsersAsync();
    }
}
