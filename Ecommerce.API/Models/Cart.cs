using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ECommerce.API.Models
{
    public class Cart
    {
        [Key]
        public int CartId { get; set; }
        
        [Required]
        public int UserId { get; set; }
        
        [Required]
        public int ProductId { get; set; }
        
        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }
        
        public DateTime AddedDate { get; set; } = DateTime.UtcNow;
        
        [JsonIgnore]
        public User? User { get; set; }
        
        [JsonIgnore]
        public Product? Product { get; set; }
    }
}