using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ECommerce.API.Models
{
    public class OrderItem
    {
        [Key]
        public int OrderItemId { get; set; }
        
        [Required]
        public int OrderId { get; set; }
        
        [Required]
        public int ProductId { get; set; }
        
        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }
        
        [Required]
        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }
        
        [JsonIgnore]
        public Order? Order { get; set; }
        
        [JsonIgnore]
        public Product? Product { get; set; }
    }
}