using AutoMapper;
using Payment_Service.Services.Interfaces;
using Payment_Service.Models;
using Payment_Service.Models.DTOs;
using Payment_Service.Data.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Payment_Service.Services.Implementations
{
    public class PaymentService : IPaymentService
    {
        private readonly IRepository<Payment> _paymentRepository;
        private readonly IUserServiceClient _userServiceClient;
        private readonly IMapper _mapper;

        public PaymentService(
            IRepository<Payment> paymentRepository,
            IUserServiceClient userServiceClient,
            IMapper mapper)
        {
            _paymentRepository = paymentRepository;
            _userServiceClient = userServiceClient;
            _mapper = mapper;
        }

        public async Task<IEnumerable<PaymentDto>> GetAllPaymentsAsync()
        {
            var payments = await _paymentRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<PaymentDto>>(payments);
        }

        public async Task<PaymentDto> GetPaymentByIdAsync(int id)
        {
            var payment = await _paymentRepository.GetByIdAsync(id);
            return _mapper.Map<PaymentDto>(payment);
        }

        public async Task<PaymentDto> CreatePaymentAsync(CreatePaymentDto createDto)
        {
            if (!await _userServiceClient.UserExistsAsync(createDto.UserId))
            {
                throw new InvalidOperationException($"User with ID {createDto.UserId} not found.");
            }

            var payment = _mapper.Map<Payment>(createDto);
            payment.PaymentDate = DateTime.UtcNow;
            payment.Status = "Pending"; // Initial status
            
            // Process payment (in a real app, this would integrate with a payment processor)
            // For now, we'll just simulate a successful payment
            payment.Status = "Completed";
            payment.ProcessedDate = DateTime.UtcNow;
            payment.TransactionId = $"TXN-{Guid.NewGuid().ToString("N").Substring(0, 12).ToUpper()}";
            
            var createdPayment = await _paymentRepository.AddAsync(payment);
            return _mapper.Map<PaymentDto>(createdPayment);
        }

        public async Task UpdatePaymentAsync(int id, PaymentDto updateDto)
        {
            var payment = await _paymentRepository.GetByIdAsync(id);
            if (payment == null)
                throw new KeyNotFoundException($"Payment with ID {id} not found.");

            payment.UserId = updateDto.UserId;
            payment.Amount = (float)updateDto.Amount;
            payment.Status = updateDto.Status;
            payment.PaymentDate = updateDto.PaymentDate;
            payment.ProcessedDate = updateDto.ProcessedDate;
            payment.TransactionId = updateDto.TransactionId;

            await _paymentRepository.UpdateAsync(payment);
        }

        public async Task DeletePaymentAsync(int id)
        {
            var exists = await _paymentRepository.ExistsAsync(id);
            if (!exists)
                throw new KeyNotFoundException($"Payment with ID {id} not found.");

            await _paymentRepository.DeleteAsync(id);
        }
    }
}
