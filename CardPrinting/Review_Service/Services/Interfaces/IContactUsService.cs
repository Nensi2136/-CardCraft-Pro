using Review_Service.DTOs;

namespace Review_Service.Services.Interfaces
{
    public interface IContactUsService
    {
        Task<IEnumerable<ContactUsDto>> GetAllAsync();
        Task<ContactUsDto?> GetByIdAsync(int id);
        Task<ContactUsDto> CreateAsync(CreateContactUsDto contactUs);
        Task<bool> UpdateAsync(int id, UpdateContactUsDto contactUs);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
}
