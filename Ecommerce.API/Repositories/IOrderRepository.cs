using ECommerce.API.Models;

namespace ECommerce.API.Repositories
{
    public interface IOrderRepository
    {
        Task<Order> CreateOrderAsync(Order order);
        Task<Order?> GetOrderByIdAsync(int id);
        Task<IEnumerable<Order>> GetAllOrdersAsync();
        Task<IEnumerable<Order>> GetOrdersByUserIdAsync(int userId);
        Task<User?> GetUserByIdAsync(int userId);
        Task<Product?> GetProductByIdAsync(int productId);
        Task<bool> UpdateOrderStatusAsync(int orderId, string status);
    }
}