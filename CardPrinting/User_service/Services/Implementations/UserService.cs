using AutoMapper;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using User_Service.Data.Interfaces;
using User_Service.Models;
using User_Service.Models.DTOs;
using User_Service.Services.Interfaces;

namespace User_Service.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UserService(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
        {
            var users = await _userRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<UserDto>>(users);
        }

        public async Task<UserDto> GetUserByIdAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            return _mapper.Map<UserDto>(user);
        }

        public async Task<UserDto> CreateUserAsync(CreateUserDto createUserDto)
        {
            var user = _mapper.Map<UserDetail>(createUserDto);
            
            // Password hashing (using simple Base64 as placeholder per existing code logic)
            // In production, use BCrypt or Argon2
            user.Password_hash = HashPassword(createUserDto.Password) ?? string.Empty;
            user.Created_at = DateTime.UtcNow;
            
            // Ensure boolean defaults
            user.Is_premium = false;
            user.Is_admin = false;

            var createdUser = await _userRepository.AddAsync(user);
            return _mapper.Map<UserDto>(createdUser);
        }

        public async Task UpdateUserAsync(int id, UpdateUserDto updateDto)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
            {
                throw new KeyNotFoundException($"User with ID {id} not found.");
            }

            _mapper.Map(updateDto, user);
            user.Updated_at = DateTime.UtcNow;

            await _userRepository.UpdateAsync(user);
        }

        public async Task DeleteUserAsync(int id)
        {
            // BaseRepository DeleteAsync(int id) handles fetching and removing
            await _userRepository.DeleteAsync(id);
        }

        public async Task<bool> UserExistsAsync(int id)
        {
            return await _userRepository.ExistsAsync(id);
        }

        public async Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto changePasswordDto)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return false;

            // Verify current password
            if (user.Password_hash != HashPassword(changePasswordDto.CurrentPassword))
                return false;

            // Update to new password
            user.Password_hash = HashPassword(changePasswordDto.NewPassword) ?? string.Empty;
            user.Updated_at = DateTime.UtcNow;

            await _userRepository.UpdateAsync(user);
            return true;
        }

        public async Task<bool> ValidateUserCredentialsAsync(string username, string password)
        {
            var user = await _userRepository.GetByUsernameAsync(username);
            
            if (user == null)
            {
                return false;
            }

            // Simple hash comparison
            return user.Password_hash == HashPassword(password);
        }

        public async Task<UserDto> AuthenticateUserAsync(string username, string password)
        {
            // Try to find user by username first, then by email
            var user = await _userRepository.GetByUsernameAsync(username);
            if (user == null)
            {
                user = await _userRepository.GetByEmailAsync(username);
            }
            
            if (user == null || user.Password_hash != HashPassword(password))
            {
                return null;
            }

            return _mapper.Map<UserDto>(user);
        }

        public async Task UpgradeToPremiumAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
            {
                throw new KeyNotFoundException($"User with ID {id} not found.");
            }

            user.Is_premium = true;
            user.Updated_at = DateTime.UtcNow;

            await _userRepository.UpdateAsync(user);
        }

        public async Task ToggleAdminStatusAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
            {
                throw new KeyNotFoundException($"User with ID {id} not found.");
            }

            user.Is_admin = !user.Is_admin;
            user.Updated_at = DateTime.UtcNow;

            await _userRepository.UpdateAsync(user);
        }

        public async Task<UserDto> GetUserByEmailAsync(string email)
        {
            var user = await _userRepository.GetByEmailAsync(email);
            return _mapper.Map<UserDto>(user);
        }

        public async Task<IEnumerable<UserDto>> GetPremiumUsersAsync()
        {
            var users = await _userRepository.GetPremiumUsersAsync();
            return _mapper.Map<IEnumerable<UserDto>>(users);
        }

        public async Task<IEnumerable<UserDto>> GetAdminUsersAsync()
        {
            var users = await _userRepository.GetAdminUsersAsync();
            return _mapper.Map<IEnumerable<UserDto>>(users);
        }

        private string? HashPassword(string password)
        {
            if (string.IsNullOrEmpty(password)) return null;
            return Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(password));
        }
    }
}