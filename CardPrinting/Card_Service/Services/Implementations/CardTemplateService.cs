using AutoMapper;
using Card_Service.Data.Interfaces;
using Card_Service.Models;
using Card_Service.Models.DTOs;
using Card_Service.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using CardTemplateDTO = Card_Service.Models.DTOs.CardTemplateDto;

namespace Card_Service.Services.Implementations
{
    public class CardTemplateService : ICardTemplateService
    {
        private readonly ICardTemplateRepository _templateRepository;
        private readonly IMapper _mapper;

        public CardTemplateService(ICardTemplateRepository templateRepository, IMapper mapper)
        {
            _templateRepository = templateRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CardTemplateDto>> GetAllTemplatesAsync()
        {
            var cardTemplates = await _templateRepository.GetAllAsync();
            return cardTemplates.Select(static ct => new CardTemplateDto
            {
                Id = ct.Id,
                CategoryId = ct.CategoryId,
                Title = ct.Title,
                Description = ct.Description ?? string.Empty,
                FilePath = ct.FilePath,
                IsPremium = ct.IsPremium,
                CreatedAt = ct.CreatedAt,
                UpdatedAt = ct.UpdatedAt
            });
        }

        public async Task<CardTemplateDto> GetTemplateByIdAsync(int id)
        {
            var template = await _templateRepository.GetByIdAsync(id);
            return _mapper.Map<CardTemplateDto>(template);
        }

        public async Task<CardTemplateDto> CreateTemplateAsync(CreateCardTemplateDto createDto)
        {
            var template = _mapper.Map<CardTemplate>(createDto);
            var createdTemplate = await _templateRepository.AddAsync(template);
            return _mapper.Map<CardTemplateDto>(createdTemplate);
        }

        public async Task UpdateTemplateAsync(int id, UpdateCardTemplateDto updateDto)
        {
            var existingTemplate = await _templateRepository.GetByIdAsync(id);
            if (existingTemplate == null)
                throw new KeyNotFoundException($"Template with ID {id} not found.");

            _mapper.Map(updateDto, existingTemplate);
            await _templateRepository.UpdateAsync(existingTemplate);
        }

        public async Task UpdateAsync(int id, CardTemplateDto cardTemplateDto)
        {
            var existingTemplate = await _templateRepository.GetByIdAsync(id);
            if (existingTemplate == null)
                throw new KeyNotFoundException($"Template with ID {id} not found.");

            _mapper.Map(cardTemplateDto, existingTemplate);
            await _templateRepository.UpdateAsync(existingTemplate);
        }

        public async Task DeleteTemplateAsync(int id)
        {
            await _templateRepository.DeleteAsync(id);
        }

        public async Task<bool> TemplateExistsAsync(int id)
        {
            return await _templateRepository.ExistsAsync(id);
        }

        public Task UpdateAsync(int id, DTOs.CardTemplateDTO cardTemplateDto)
        {
            // Map CardTemplateDTO to UpdateCardTemplateDto and use the existing UpdateAsync method
            var updateDto = new UpdateCardTemplateDto
            {
                Name = cardTemplateDto.Title,
                Description = cardTemplateDto.Description,
                TemplateData = cardTemplateDto.FilePath,
                CategoryId = cardTemplateDto.CategoryId,
                IsPremium = cardTemplateDto.IsPremium
            };
            
            return UpdateTemplateAsync(id, updateDto);
        }
    }
}
