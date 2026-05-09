using System.ComponentModel.DataAnnotations;

namespace ECommerce.API.DTOs
{
    public class CreateOrderDto
    {
        [Required(ErrorMessage = "User ID is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Invalid user ID")]
        public int UserId { get; set; }
        
        [Required(ErrorMessage = "Cart cannot be empty")]
        [MinLength(1, ErrorMessage = "At least one item is required")]
        public List<CartItemDto> CartItems { get; set; } = new List<CartItemDto>();
        
        [Required(ErrorMessage = "Shipping address is required")]
        [MaxLength(500, ErrorMessage = "Shipping address cannot exceed 500 characters")]
        public string ShippingAddress { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Payment method is required")]
        [MaxLength(50, ErrorMessage = "Payment method cannot exceed 50 characters")]
        public string PaymentMethod { get; set; } = string.Empty;
    }
    
    public class CartItemDto
    {
        [Required(ErrorMessage = "Product ID is required")]
        [Range(1, int.MaxValue, ErrorMessage = "Invalid product ID")]
        public int ProductId { get; set; }
        
        [Required(ErrorMessage = "Quantity is required")]
        [Range(1, 100, ErrorMessage = "Quantity must be between 1 and 100")]
        public int Quantity { get; set; }
    }
}