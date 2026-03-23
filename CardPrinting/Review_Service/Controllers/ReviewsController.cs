using Microsoft.AspNetCore.Mvc;
using Review_Service.DTOs;
using Review_Service.Services.Interfaces;
using System.Linq;

namespace Review_Service.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public ReviewsController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        // GET: api/Reviews
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReviewDto>>> GetReviews()
        {
            var reviews = await _reviewService.GetAllAsync();
            return Ok(reviews);
        }

        // GET: api/Reviews/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ReviewDto>> GetReview(int id)
        {
            var review = await _reviewService.GetByIdAsync(id);

            if (review == null)
            {
                return NotFound();
            }

            return Ok(review);
        }

        // GET: api/Reviews/statistics
        [HttpGet("statistics")]
        public async Task<ActionResult<object>> GetStatistics()
        {
            var reviews = await _reviewService.GetAllAsync();
            var totalReviews = reviews.Count();
            // Since there's no IsApproved property, we'll consider all reviews as pending for now
            var verifiedReviews = 0; // reviews.Count(r => r.IsApproved);
            var pendingReviews = totalReviews - verifiedReviews;
            var averageRating = reviews.Any() ? reviews.Average(r => r.Rating) : 0;

            var statistics = new
            {
                totalReviews,
                verifiedReviews,
                pendingReviews,
                averageRating,
                ratingDistribution = new
                {
                    fiveStar = reviews.Count(r => r.Rating == 5),
                    fourStar = reviews.Count(r => r.Rating == 4),
                    threeStar = reviews.Count(r => r.Rating == 3),
                    twoStar = reviews.Count(r => r.Rating == 2),
                    oneStar = reviews.Count(r => r.Rating == 1)
                }
            };

            return Ok(statistics);
        }

        // PUT: api/Reviews/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutReview(int id, UpdateReviewDto review)
        {
            var updated = await _reviewService.UpdateAsync(id, review);
            if (!updated)
            {
                return NotFound();
            }

            return NoContent();
        }

        // POST: api/Reviews
        [HttpPost]
        public async Task<ActionResult<ReviewDto>> PostReview(CreateReviewDto review)
        {
            var created = await _reviewService.CreateAsync(review);
            return CreatedAtAction("GetReview", new { id = created.Review_Id }, created);
        }

        // DELETE: api/Reviews/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            var deleted = await _reviewService.DeleteAsync(id);
            if (!deleted)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
