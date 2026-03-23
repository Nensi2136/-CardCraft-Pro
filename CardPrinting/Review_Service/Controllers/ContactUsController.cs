using Microsoft.AspNetCore.Mvc;
using Review_Service.DTOs;
using Review_Service.Services.Interfaces;

namespace Review_Service.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactUsController : ControllerBase
    {
        private readonly IContactUsService _contactUsService;

        public ContactUsController(IContactUsService contactUsService)
        {
            _contactUsService = contactUsService;
        }

        // GET: api/ContactUs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ContactUsDto>>> GetContact_Us()
        {
            var items = await _contactUsService.GetAllAsync();
            return Ok(items);
        }

        // GET: api/ContactUs/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ContactUsDto>> GetContactUs(int id)
        {
            var contactUs = await _contactUsService.GetByIdAsync(id);

            if (contactUs == null)
            {
                return NotFound();
            }

            return Ok(contactUs);
        }

        // PUT: api/ContactUs/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutContactUs(int id, UpdateContactUsDto contactUs)
        {
            var updated = await _contactUsService.UpdateAsync(id, contactUs);
            if (!updated)
            {
                return NotFound();
            }

            return NoContent();
        }

        // POST: api/ContactUs
        [HttpPost]
        public async Task<ActionResult<ContactUsDto>> PostContactUs(CreateContactUsDto contactUs)
        {
            var created = await _contactUsService.CreateAsync(contactUs);
            return CreatedAtAction("GetContactUs", new { id = created.Contact_Id }, created);
        }

        // DELETE: api/ContactUs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContactUs(int id)
        {
            var deleted = await _contactUsService.DeleteAsync(id);
            if (!deleted)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
