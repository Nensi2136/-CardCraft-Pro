using System.Collections.Generic;
using System.Threading.Tasks;
using User_Service.Models;

namespace User_Service.Data.Interfaces
{
    public interface IUserRepository : IRepository<UserDetail>
    {
        Task<UserDetail?> GetByUsernameAsync(string username);
        Task<UserDetail?> GetByEmailAsync(string email);
        Task<UserDetail?> GetByUsernameOrEmailAsync(string username, string email);
        Task<IEnumerable<UserDetail>> GetPremiumUsersAsync();
        Task<IEnumerable<UserDetail>> GetAdminUsersAsync();
        Task SaveChangesAsync();
    }
}
