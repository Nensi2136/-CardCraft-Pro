using User_Service.Data.Interfaces;

namespace User_Service.Data.Repositories
{
    public class Repository<T> : BaseRepository<T>, IRepository<T> where T : class
    {
        public Repository(UserDbContext context) : base(context)
        {
        }
    }
}
