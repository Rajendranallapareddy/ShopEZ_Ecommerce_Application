using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ECommerce.API.Models
{
    public class Product
    {
        [Key]
        public int ProductId { get; set; }
        
        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;
        
        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Price { get; set; }
        
        [MaxLength(500)]
        public string ImageUrl { get; set; } = string.Empty;
        
        [Required]
        [Range(0, int.MaxValue)]
        public int Stock { get; set; }
        
        [MaxLength(50)]
        public string Category { get; set; } = string.Empty;
        
        public bool IsFeatured { get; set; } = false;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        [JsonIgnore]
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}