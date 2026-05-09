using System.ComponentModel.DataAnnotations;

namespace ECommerce.API.DTOs
{
    public class UpdateProductDto
    {
        [StringLength(200, MinimumLength = 2, ErrorMessage = "Product name must be between 2 and 200 characters")]
        public string? Name { get; set; }
        
        [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
        public string? Description { get; set; }
        
        [Range(0.01, 9999999.99, ErrorMessage = "Price must be between 0.01 and 9,999,999.99")]
        public decimal? Price { get; set; }
        
        [Url(ErrorMessage = "Invalid URL format")]
        [StringLength(500, ErrorMessage = "Image URL cannot exceed 500 characters")]
        public string? ImageUrl { get; set; }
        
        [Range(0, 1000000, ErrorMessage = "Stock must be between 0 and 1,000,000")]
        public int? Stock { get; set; }
        
        [StringLength(50, ErrorMessage = "Category cannot exceed 50 characters")]
        public string? Category { get; set; }
        
        public bool? IsFeatured { get; set; }
    }
}