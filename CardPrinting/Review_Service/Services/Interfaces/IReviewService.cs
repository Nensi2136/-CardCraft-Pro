using Review_Service.DTOs;

namespace Review_Service.Services.Interfaces
{
    public interface IReviewService
    {
        Task<IEnumerable<ReviewDto>> GetAllAsync();
        Task<ReviewDto?> GetByIdAsync(int id);
        Task<ReviewDto> CreateAsync(CreateReviewDto review);
        Task<bool> UpdateAsync(int id, UpdateReviewDto review);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
}
