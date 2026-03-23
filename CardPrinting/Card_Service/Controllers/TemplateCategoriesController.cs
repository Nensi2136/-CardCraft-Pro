using Card_Service.Models.DTOs;
using Card_Service.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Card_Service.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TemplateCategoriesController : ControllerBase
    {
        private readonly ITemplateCategoryService _categoryService;

        public TemplateCategoriesController(ITemplateCategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        // GET: api/TemplateCategories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TemplateCategoryResponseDto>>> GetTemplate_Categories()
        {
            var categories = await _categoryService.GetAllAsync();
            return Ok(categories);
        }

        // GET: api/TemplateCategories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TemplateCategoryResponseDto>> GetTemplateCategory(int id)
        {
            var category = await _categoryService.GetByIdAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            return Ok(category);
        }

        // PUT: api/TemplateCategories/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTemplateCategory(int id, [FromBody] CreateTemplateCategoryDto templateCategory)
        {
            var updated = await _categoryService.UpdateAsync(id, templateCategory);
            if (!updated)
            {
                return NotFound();
            }

            return NoContent();
        }

        // POST: api/TemplateCategories
        [HttpPost]
        public async Task<ActionResult<TemplateCategoryResponseDto>> PostTemplateCategory(CreateTemplateCategoryDto createDto)
        {
            var created = await _categoryService.CreateAsync(createDto);
            return CreatedAtAction(nameof(GetTemplateCategory), new { id = created.CategoryId }, created);
        }

        // DELETE: api/TemplateCategories/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTemplateCategory(int id)
        {
            var deleted = await _categoryService.DeleteAsync(id);
            if (!deleted)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
