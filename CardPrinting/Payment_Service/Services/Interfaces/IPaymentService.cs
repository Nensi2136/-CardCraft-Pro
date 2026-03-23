using Payment_Service.Models.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Payment_Service.Services.Interfaces
{
    public interface IPaymentService
    {
        Task<IEnumerable<PaymentDto>> GetAllPaymentsAsync();
        Task<PaymentDto> GetPaymentByIdAsync(int id);
        Task<PaymentDto> CreatePaymentAsync(CreatePaymentDto createDto);
        Task UpdatePaymentAsync(int id, PaymentDto updateDto);
        Task DeletePaymentAsync(int id);
    }
}
