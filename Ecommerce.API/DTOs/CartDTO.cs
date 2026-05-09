using System.ComponentModel.DataAnnotations;

namespace ECommerce.API.DTOs
{
    public class AddToCartDto
    {
        [Required]
        [Range(1, int.MaxValue)]
        public int ProductId { get; set; }
        
        [Required]
        [Range(1, 100)]
        public int Quantity { get; set; } = 1;
    }
    
    public class UpdateCartItemDto
    {
        [Required]
        [Range(1, int.MaxValue)]
        public int ProductId { get; set; }
        
        [Required]
        [Range(1, 100)]
        public int Quantity { get; set; }
    }
    
    public class CartItemResponseDto
    {
        public int CartId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string ProductImage { get; set; } = string.Empty;
        public decimal ProductPrice { get; set; }
        public int Quantity { get; set; }
        public decimal Subtotal { get; set; }
    }
    
    public class CartSummaryDto
    {
        public List<CartItemResponseDto> Items { get; set; } = new();
        public int TotalItems { get; set; }
        public decimal Subtotal { get; set; }
        public decimal Shipping { get; set; }
        public decimal Tax { get; set; }
        public decimal Total { get; set; }
    }
}