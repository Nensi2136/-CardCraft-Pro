using AutoMapper;
using Review_Service.DTOs;
using Review_Service.Data.Interfaces;
using Review_Service.Models;
using Review_Service.Services.Interfaces;
using System;

namespace Review_Service.Services.Implementations
{
    public class ReviewService : IReviewService
    {
        private readonly IRepository<Review> _reviewRepository;
        private readonly IMapper _mapper;

        public ReviewService(IRepository<Review> reviewRepository, IMapper mapper)
        {
            _reviewRepository = reviewRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<ReviewDto>> GetAllAsync()
        {
            var reviews = await _reviewRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<ReviewDto>>(reviews);
        }

        public async Task<ReviewDto?> GetByIdAsync(int id)
        {
            var review = await _reviewRepository.GetByIdAsync(id);
            return review == null ? null : _mapper.Map<ReviewDto>(review);
        }

        public async Task<ReviewDto> CreateAsync(CreateReviewDto review)
        {
            var entity = _mapper.Map<Review>(review);
            entity.Created_At = DateTime.UtcNow;
            var created = await _reviewRepository.AddAsync(entity);
            return _mapper.Map<ReviewDto>(created);
        }

        public async Task<bool> UpdateAsync(int id, UpdateReviewDto review)
        {
            var existing = await _reviewRepository.GetByIdAsync(id);
            if (existing == null)
            {
                return false;
            }

            _mapper.Map(review, existing);
            await _reviewRepository.UpdateAsync(existing);
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            if (!await _reviewRepository.ExistsAsync(id))
            {
                return false;
            }

            await _reviewRepository.DeleteAsync(id);
            return true;
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _reviewRepository.ExistsAsync(id);
        }
    }
}
