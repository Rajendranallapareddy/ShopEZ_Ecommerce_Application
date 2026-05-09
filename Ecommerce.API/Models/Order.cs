using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ECommerce.API.Models
{
    public class Order
    {
        [Key]
        public int OrderId { get; set; }
        
        [Required]
        public int UserId { get; set; }
        
        [Required]
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        
        [Required]
        [Range(0, double.MaxValue)]
        public decimal TotalAmount { get; set; }
        
        [MaxLength(50)]
        public string Status { get; set; } = "Pending";
        
        [MaxLength(500)]
        public string ShippingAddress { get; set; } = string.Empty;
        
        [MaxLength(50)]
        public string PaymentMethod { get; set; } = string.Empty;
        
        [JsonIgnore]
        public User? User { get; set; }
        
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}