using Microsoft.EntityFrameworkCore;
using ECommerce.API.Models;

namespace ECommerce.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        
        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // User configuration
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();
            
            // Order configuration
            modelBuilder.Entity<Order>()
                .HasOne(o => o.User)
                .WithMany(u => u.Orders)
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Restrict);
            
            // OrderItem configuration
            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Order)
                .WithMany(o => o.OrderItems)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
            
            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Product)
                .WithMany(p => p.OrderItems)
                .HasForeignKey(oi => oi.ProductId)
                .OnDelete(DeleteBehavior.Restrict);
            
            // Seed data
            SeedData(modelBuilder);
        }
        
        private void SeedData(ModelBuilder modelBuilder)
        {
            // Seed Users
            modelBuilder.Entity<User>().HasData(
                new User { UserId = 1, Name = "Admin User", Email = "admin@shopez.com", PasswordHash = "$2a$11$QrZJzXJzY3ZxYzZxYzZuOeZxYzZxYzZxYzZxYzZxYzZxYzZxYz", Role = "Admin", CreatedAt = DateTime.UtcNow },
                new User { UserId = 2, Name = "John Customer", Email = "john@example.com", PasswordHash = "$2a$11$QrZJzXJzY3ZxYzZxYzZuOeZxYzZxYzZxYzZxYzZxYzZxYzZxYz", Role = "Customer", CreatedAt = DateTime.UtcNow },
                new User { UserId = 3, Name = "Jane Smith", Email = "jane@example.com", PasswordHash = "$2a$11$QrZJzXJzY3ZxYzZxYzZuOeZxYzZxYzZxYzZxYzZxYzZxYzZxYz", Role = "Customer", CreatedAt = DateTime.UtcNow }
            );
            
            // Seed Products
            modelBuilder.Entity<Product>().HasData(
                new Product { ProductId = 1, Name = "MacBook Pro 14", Description = "Apple M3 Pro chip, 18GB RAM, 512GB SSD", Price = 189999, ImageUrl = "https://picsum.photos/id/0/300/300", Stock = 10, Category = "Electronics", IsFeatured = true, CreatedAt = DateTime.UtcNow },
                new Product { ProductId = 2, Name = "iPhone 15 Pro Max", Description = "6.7-inch display, A17 Pro chip, 256GB", Price = 149999, ImageUrl = "https://picsum.photos/id/1/300/300", Stock = 15, Category = "Electronics", IsFeatured = true, CreatedAt = DateTime.UtcNow },
                new Product { ProductId = 3, Name = "Sony WH-1000XM5", Description = "Industry-leading noise cancellation", Price = 29999, ImageUrl = "https://picsum.photos/id/2/300/300", Stock = 25, Category = "Audio", IsFeatured = true, CreatedAt = DateTime.UtcNow },
                new Product { ProductId = 4, Name = "Logitech MX Master 3S", Description = "Quiet clicks, 8K DPI tracking", Price = 8999, ImageUrl = "https://picsum.photos/id/3/300/300", Stock = 30, Category = "Accessories", IsFeatured = false, CreatedAt = DateTime.UtcNow },
                new Product { ProductId = 5, Name = "Samsung Odyssey G9", Description = "49-inch curved gaming monitor", Price = 149999, ImageUrl = "https://picsum.photos/id/4/300/300", Stock = 5, Category = "Electronics", IsFeatured = true, CreatedAt = DateTime.UtcNow },
                new Product { ProductId = 6, Name = "Keychron K2 Pro", Description = "Wireless mechanical keyboard", Price = 7999, ImageUrl = "https://picsum.photos/id/5/300/300", Stock = 20, Category = "Accessories", IsFeatured = false, CreatedAt = DateTime.UtcNow },
                new Product { ProductId = 7, Name = "Apple Watch Ultra 2", Description = "49mm titanium case", Price = 89999, ImageUrl = "https://picsum.photos/id/6/300/300", Stock = 12, Category = "Electronics", IsFeatured = true, CreatedAt = DateTime.UtcNow },
                new Product { ProductId = 8, Name = "iPad Pro 12.9\"", Description = "M2 chip, Liquid Retina XDR display", Price = 119999, ImageUrl = "https://picsum.photos/id/7/300/300", Stock = 8, Category = "Electronics", IsFeatured = false, CreatedAt = DateTime.UtcNow }
            );
        }
    }
}