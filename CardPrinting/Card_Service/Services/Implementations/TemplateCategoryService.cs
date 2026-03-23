using Card_Service.Data.Interfaces;
using Card_Service.Models;
using Card_Service.Models.DTOs;
using Card_Service.Services.Interfaces;

namespace Card_Service.Services.Implementations
{
    public class TemplateCategoryService : ITemplateCategoryService
    {
        private readonly ITemplateCategoryRepository _categoryRepository;

        public TemplateCategoryService(ITemplateCategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<IEnumerable<TemplateCategoryResponseDto>> GetAllAsync()
        {
            var categories = await _categoryRepository.GetAllAsync();
            return categories.Select(MapToResponseDto);
        }

        public async Task<TemplateCategoryResponseDto?> GetByIdAsync(int id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            return category == null ? null : MapToResponseDto(category);
        }

        public async Task<TemplateCategoryResponseDto> CreateAsync(CreateTemplateCategoryDto createDto)
        {
            var entity = new TemplateCategory
            {
                Name = createDto.Category_Name,
                Description = createDto.Category_Description,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var created = await _categoryRepository.AddAsync(entity);
            return MapToResponseDto(created);
        }

        public async Task<bool> UpdateAsync(int id, CreateTemplateCategoryDto updateDto)
        {
            var existing = await _categoryRepository.GetByIdAsync(id);
            if (existing == null)
            {
                return false;
            }

            existing.Name = updateDto.Category_Name;
            existing.Description = updateDto.Category_Description;
            existing.UpdatedAt = DateTime.UtcNow;

            await _categoryRepository.UpdateAsync(existing);
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            if (!await _categoryRepository.ExistsAsync(id))
            {
                return false;
            }

            await _categoryRepository.DeleteAsync(id);
            return true;
        }

        private static TemplateCategoryResponseDto MapToResponseDto(TemplateCategory category)
        {
            return new TemplateCategoryResponseDto
            {
                CategoryId = category.Category_Id,
                CategoryName = category.Name,
                CategoryDescription = category.Description,
                CreatedAt = category.CreatedAt,
                UpdatedAt = category.UpdatedAt
            };
        }
    }
}
