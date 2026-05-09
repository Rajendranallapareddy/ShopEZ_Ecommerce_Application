using ECommerce.API.DTOs;
using ECommerce.API.Models;
using ECommerce.API.Repositories;

namespace ECommerce.API.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepo;
        private readonly IProductRepository _productRepo;
        
        public OrderService(IOrderRepository orderRepo, IProductRepository productRepo)
        {
            _orderRepo = orderRepo;
            _productRepo = productRepo;
        }
        
        public async Task<OrderResponseDto> CreateOrderAsync(CreateOrderDto dto)
        {
            // Validate user exists
            var user = await _orderRepo.GetUserByIdAsync(dto.UserId);
            if (user == null)
                throw new ArgumentException($"User not found. Please login again.");
            
            // Validate cart is not empty
            if (dto.CartItems == null || !dto.CartItems.Any())
                throw new ArgumentException("Your cart is empty. Please add items before checking out.");
            
            decimal totalAmount = 0;
            var orderItems = new List<OrderItem>();
            var errors = new List<string>();
            
            // Process each cart item
            foreach (var cartItem in dto.CartItems)
            {
                // Validate product existence
                var product = await _orderRepo.GetProductByIdAsync(cartItem.ProductId);
                if (product == null)
                {
                    errors.Add($"Product with ID {cartItem.ProductId} not found");
                    continue;
                }
                
                // Validate quantity
                if (cartItem.Quantity <= 0)
                {
                    errors.Add($"Invalid quantity for product '{product.Name}'");
                    continue;
                }
                
                // Check stock availability
                if (product.Stock < cartItem.Quantity)
                {
                    errors.Add($"Insufficient stock for '{product.Name}'. Available: {product.Stock}, Requested: {cartItem.Quantity}");
                    continue;
                }
                
                // Calculate total
                var itemTotal = product.Price * cartItem.Quantity;
                totalAmount += itemTotal;
                
                // Create order item
                orderItems.Add(new OrderItem
                {
                    ProductId = cartItem.ProductId,
                    Quantity = cartItem.Quantity,
                    Price = product.Price
                });
            }
            
            // If there were errors, throw them
            if (errors.Any())
                throw new ArgumentException(string.Join(" | ", errors));
            
            if (orderItems.Count == 0)
                throw new ArgumentException("No valid items in cart to order");
            
            // Create order
            var order = new Order
            {
                UserId = dto.UserId,
                OrderDate = DateTime.UtcNow,
                TotalAmount = totalAmount,
                Status = "Pending",
                ShippingAddress = dto.ShippingAddress ?? "No address provided",
                PaymentMethod = dto.PaymentMethod ?? "COD",
                OrderItems = orderItems
            };
            
            // Save order to database
            var createdOrder = await _orderRepo.CreateOrderAsync(order);
            
            // Update stock for each product
            foreach (var cartItem in dto.CartItems)
            {
                await _productRepo.UpdateStockAsync(cartItem.ProductId, cartItem.Quantity);
            }
            
            // Return response
            var response = await GetOrderByIdAsync(createdOrder.OrderId);
            if (response == null)
                throw new Exception("Failed to retrieve created order");
            
            return response;
        }
        
        public async Task<OrderResponseDto?> GetOrderByIdAsync(int id)
        {
            var order = await _orderRepo.GetOrderByIdAsync(id);
            if (order == null)
                return null;
            
            return new OrderResponseDto
            {
                OrderId = order.OrderId,
                UserId = order.UserId,
                UserName = order.User?.Name ?? "Unknown",
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                ShippingAddress = order.ShippingAddress,
                PaymentMethod = order.PaymentMethod,
                Items = order.OrderItems.Select(oi => new OrderItemResponseDto
                {
                    ProductId = oi.ProductId,
                    ProductName = oi.Product?.Name ?? "Unknown",
                    Quantity = oi.Quantity,
                    Price = oi.Price,
                    Subtotal = oi.Price * oi.Quantity
                }).ToList()
            };
        }
        
        public async Task<IEnumerable<OrderResponseDto>> GetAllOrdersAsync()
        {
            var orders = await _orderRepo.GetAllOrdersAsync();
            return orders.Select(order => new OrderResponseDto
            {
                OrderId = order.OrderId,
                UserId = order.UserId,
                UserName = order.User?.Name ?? "Unknown",
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                ShippingAddress = order.ShippingAddress,
                PaymentMethod = order.PaymentMethod,
                Items = order.OrderItems.Select(oi => new OrderItemResponseDto
                {
                    ProductId = oi.ProductId,
                    ProductName = oi.Product?.Name ?? "Unknown",
                    Quantity = oi.Quantity,
                    Price = oi.Price,
                    Subtotal = oi.Price * oi.Quantity
                }).ToList()
            });
        }
        
        public async Task<IEnumerable<OrderResponseDto>> GetOrdersByUserIdAsync(int userId)
        {
            var orders = await _orderRepo.GetOrdersByUserIdAsync(userId);
            return orders.Select(order => new OrderResponseDto
            {
                OrderId = order.OrderId,
                UserId = order.UserId,
                UserName = order.User?.Name ?? "Unknown",
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                ShippingAddress = order.ShippingAddress,
                PaymentMethod = order.PaymentMethod,
                Items = order.OrderItems.Select(oi => new OrderItemResponseDto
                {
                    ProductId = oi.ProductId,
                    ProductName = oi.Product?.Name ?? "Unknown",
                    Quantity = oi.Quantity,
                    Price = oi.Price,
                    Subtotal = oi.Price * oi.Quantity
                }).ToList()
            });
        }
    }
}