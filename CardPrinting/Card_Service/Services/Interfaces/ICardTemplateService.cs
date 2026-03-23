using Card_Service.DTOs;
using Card_Service.Models.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Card_Service.Services.Interfaces
{
    public interface ICardTemplateService
    {
        Task<IEnumerable<CardTemplateDto>> GetAllTemplatesAsync();
        Task<CardTemplateDto> GetTemplateByIdAsync(int id);
        Task<CardTemplateDto> CreateTemplateAsync(CreateCardTemplateDto createDto);
        Task UpdateTemplateAsync(int id, UpdateCardTemplateDto updateDto);
        Task DeleteTemplateAsync(int id);
        Task<bool> TemplateExistsAsync(int id);
        Task UpdateAsync(int id, CardTemplateDTO cardTemplateDto);
    }
}
