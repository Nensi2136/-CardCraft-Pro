using AutoMapper;
using Review_Service.DTOs;
using Review_Service.Data.Interfaces;
using Review_Service.Models;
using Review_Service.Services.Interfaces;
using System;

namespace Review_Service.Services.Implementations
{
    public class ContactUsService : IContactUsService
    {
        private readonly IRepository<ContactUs> _contactUsRepository;
        private readonly IMapper _mapper;

        public ContactUsService(IRepository<ContactUs> contactUsRepository, IMapper mapper)
        {
            _contactUsRepository = contactUsRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ContactUsDto>> GetAllAsync()
        {
            var items = await _contactUsRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<ContactUsDto>>(items);
        }

        public async Task<ContactUsDto?> GetByIdAsync(int id)
        {
            var item = await _contactUsRepository.GetByIdAsync(id);
            return item == null ? null : _mapper.Map<ContactUsDto>(item);
        }

        public async Task<ContactUsDto> CreateAsync(CreateContactUsDto contactUs)
        {
            var entity = _mapper.Map<ContactUs>(contactUs);
            entity.Created_at = DateTime.UtcNow;
            var created = await _contactUsRepository.AddAsync(entity);
            return _mapper.Map<ContactUsDto>(created);
        }

        public async Task<bool> UpdateAsync(int id, UpdateContactUsDto contactUs)
        {
            var existing = await _contactUsRepository.GetByIdAsync(id);
            if (existing == null)
            {
                return false;
            }

            _mapper.Map(contactUs, existing);
            await _contactUsRepository.UpdateAsync(existing);
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            if (!await _contactUsRepository.ExistsAsync(id))
            {
                return false;
            }

            await _contactUsRepository.DeleteAsync(id);
            return true;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _contactUsRepository.ExistsAsync(id);
        }
    }
}
