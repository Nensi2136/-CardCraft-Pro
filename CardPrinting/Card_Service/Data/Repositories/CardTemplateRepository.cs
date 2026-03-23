using Card_Service.Data.Interfaces;
using Card_Service.Models;
using Microsoft.EntityFrameworkCore;

namespace Card_Service.Data.Repositories
{
    public class CardTemplateRepository : BaseRepository<CardTemplate>, ICardTemplateRepository
    {
        public CardTemplateRepository(CardDbContext context) : base(context)
        {
        }

        public override async Task<IEnumerable<CardTemplate>> GetAllAsync()
        {
            return await _context.Card_Templates
                .Include(ct => ct.Category)
                .ToListAsync();
        }

        public override async Task<CardTemplate?> GetByIdAsync(int id)
        {
            return await _context.Card_Templates
                .Include(ct => ct.Category)
                .FirstOrDefaultAsync(ct => ct.Id == id);
        }
    }
}