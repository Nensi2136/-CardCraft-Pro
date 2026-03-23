using Card_Service.Data.Interfaces;
using Card_Service.Models;

namespace Card_Service.Data.Repositories
{
    public class TemplateCategoryRepository : BaseRepository<TemplateCategory>, ITemplateCategoryRepository
    {
        public TemplateCategoryRepository(CardDbContext context) : base(context)
        {
        }
    }
}
