using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using User_Service.Data.Interfaces;
using User_Service.Models;
using User_Service.Data;

namespace User_Service.Data.Repositories
{
    public class UserRepository : BaseRepository<UserDetail>, IUserRepository
    {
        public UserRepository(UserDbContext context) : base(context)
        {
        }

        public async Task<UserDetail?> GetByUsernameAsync(string username)
        {
            return await _context.User_Details
                .FirstOrDefaultAsync(u => u.Username == username);
        }

        public async Task<UserDetail?> GetByEmailAsync(string email)
        {
            return await _context.User_Details
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<UserDetail?> GetByUsernameOrEmailAsync(string username, string email)
        {
            return await _context.User_Details
                .FirstOrDefaultAsync(u => u.Username == username || u.Email == email);
        }

        public async Task<IEnumerable<UserDetail>> GetPremiumUsersAsync()
        {
            return await _context.User_Details
                .Where(u => u.Is_premium)
                .ToListAsync();
        }

        public async Task<IEnumerable<UserDetail>> GetAdminUsersAsync()
        {
            return await _context.User_Details
                .Where(u => u.Is_admin)
                .ToListAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
