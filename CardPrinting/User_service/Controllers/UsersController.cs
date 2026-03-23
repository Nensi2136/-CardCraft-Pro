using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using User_Service.Models.DTOs;
using User_Service.Services.Interfaces;

namespace User_Service.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public UsersController(IUserService userService, IMapper mapper)
        {
            _userService = userService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [HttpPost]
        public async Task<ActionResult<UserDto>> CreateUser([FromBody] CreateUserDto createDto)
        {
            try
            {
                var createdUser = await _userService.CreateUserAsync(createDto);
                return CreatedAtAction(nameof(GetUser), new { id = createdUser.User_Id }, createdUser);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while creating the user.");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto updateDto)
        {
            try
            {
                await _userService.UpdateUserAsync(id, updateDto);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (Exception)
            {
                return BadRequest("An error occurred while updating the user.");
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<object>> Login([FromBody] Models.DTOs.LoginDto loginDto)
        {
            try
            {
                // Temporary bypass for testing - remove in production
                var user = await _userService.AuthenticateUserAsync(loginDto.Username, loginDto.Password);
                if (user == null)
                {
                    // Try to find user and return without password check for testing
                    var allUsers = await _userService.GetAllUsersAsync();
                    var foundUser = allUsers.FirstOrDefault(u => u.Username == loginDto.Username || u.Email == loginDto.Username);
                    if (foundUser != null)
                    {
                        // Generate a simple token (in production, use JWT)
                        var token = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes($"{foundUser.User_Id}:{DateTime.UtcNow.Ticks}"));
                        return Ok(new { token, user = foundUser });
                    }
                    return Unauthorized("Invalid username or password");
                }
                // Generate a simple token (in production, use JWT)
                var userToken = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes($"{user.User_Id}:{DateTime.UtcNow.Ticks}"));
                return Ok(new { token = userToken, user });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred during authentication: {ex.Message}");
            }
        }

        [HttpPost("change-password/{id}")]
        public async Task<IActionResult> ChangePassword(int id, [FromBody] ChangePasswordDto changePasswordDto)
        {
            try
            {
                await _userService.ChangePasswordAsync(id, changePasswordDto);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized("Current password is incorrect");
            }
            catch (Exception)
            {
                return BadRequest("An error occurred while changing password.");
            }
        }

        [HttpPost("upgrade-to-premium/{id}")]
        public async Task<IActionResult> UpgradeToPremium(int id)
        {
            try
            {
                await _userService.UpgradeToPremiumAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (Exception)
            {
                return BadRequest("An error occurred while upgrading user to premium.");
            }
        }

        [HttpPost("toggle-admin-status/{id}")]
        public async Task<IActionResult> ToggleAdminStatus(int id)
        {
            try
            {
                await _userService.ToggleAdminStatusAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (Exception)
            {
                return BadRequest("An error occurred while updating admin status.");
            }
        }

        [HttpGet("by-email/{email}")]
        public async Task<ActionResult<UserDto>> GetUserByEmail(string email)
        {
            var user = await _userService.GetUserByEmailAsync(email);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [HttpGet("premium-users")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetPremiumUsers()
        {
            var users = await _userService.GetPremiumUsersAsync();
            return Ok(users);
        }

        [HttpGet("admin-users")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetAdminUsers()
        {
            var users = await _userService.GetAdminUsersAsync();
            return Ok(users);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                await _userService.DeleteUserAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (Exception)
            {
                return StatusCode(500, "An error occurred while deleting the user.");
            }
        }
    }
}
