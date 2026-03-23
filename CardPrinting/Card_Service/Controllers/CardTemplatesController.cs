using AutoMapper;
using Card_Service.DTOs;
using Card_Service.Models.DTOs;
using Card_Service.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Card_Service.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CardTemplatesController : ControllerBase
    {
        private readonly ICardTemplateService _cardTemplateService;
        private readonly IMapper _mapper;

        public CardTemplatesController(ICardTemplateService cardTemplateService, IMapper mapper)
        {
            _cardTemplateService = cardTemplateService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var cardTemplates = await _cardTemplateService.GetAllTemplatesAsync();
            return Ok(cardTemplates);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var cardTemplate = await _cardTemplateService.GetTemplateByIdAsync(id);
            if (cardTemplate == null)
            {
                return NotFound();
            }
            return Ok(cardTemplate);
        }

        [HttpPost]
        public async Task<ActionResult<CardTemplateDto>> CreateTemplate(CreateCardTemplateDto createDto)
        {
            try
            {
                var createdTemplate = await _cardTemplateService.CreateTemplateAsync(createDto);
                return CreatedAtAction(nameof(GetById), new { id = createdTemplate.Id }, createdTemplate);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CardTemplateDTO cardTemplateDto)
        {
            await _cardTemplateService.UpdateAsync(id, cardTemplateDto);
            // Since UpdateAsync returns void, we cannot assign its result to a variable.
            // Instead, check if the template exists to determine the response.
            var updatedCardTemplate = await _cardTemplateService.GetTemplateByIdAsync(id);
            if (updatedCardTemplate == null)
            {
                return NotFound();
            }
            return Ok(updatedCardTemplate);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            // Check if the template exists
            var exists = await _cardTemplateService.TemplateExistsAsync(id);
            if (!exists)
            {
                return NotFound();
            }

            await _cardTemplateService.DeleteTemplateAsync(id);
            return NoContent();
        }
    }
}
