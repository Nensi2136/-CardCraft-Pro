using Card_Service.Models.DTOs;

namespace Card_Service.Services.Interfaces
{
    public interface ITemplateCategoryService
    {
        Task<IEnumerable<TemplateCategoryResponseDto>> GetAllAsync();
        Task<TemplateCategoryResponseDto?> GetByIdAsync(int id);
        Task<TemplateCategoryResponseDto> CreateAsync(CreateTemplateCategoryDto createDto);
        Task<bool> UpdateAsync(int id, CreateTemplateCategoryDto updateDto);
        Task<bool> DeleteAsync(int id);
    }
}
