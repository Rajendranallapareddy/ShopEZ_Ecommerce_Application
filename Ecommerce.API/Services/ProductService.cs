using ECommerce.API.DTOs;
using ECommerce.API.Models;
using ECommerce.API.Repositories;

namespace ECommerce.API.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _repository;
        
        public ProductService(IProductRepository repository)
        {
            _repository = repository;
        }
        
        public async Task<IEnumerable<ProductDto>> GetAllAsync()
        {
            var products = await _repository.GetAllAsync();
            return products.Select(p => MapToDto(p));
        }
        
        public async Task<IEnumerable<ProductDto>> GetFeaturedAsync()
        {
            var products = await _repository.GetFeaturedAsync();
            return products.Select(p => MapToDto(p));
        }
        
        public async Task<ProductDto?> GetByIdAsync(int id)
        {
            var product = await _repository.GetByIdAsync(id);
            return product == null ? null : MapToDto(product);
        }
        
        public async Task<ProductDto> CreateAsync(CreateProductDto dto)
        {
            var product = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                ImageUrl = dto.ImageUrl,
                Stock = dto.Stock,
                Category = dto.Category,
                IsFeatured = dto.IsFeatured
            };
            
            var created = await _repository.CreateAsync(product);
            return MapToDto(created);
        }
        
        public async Task<ProductDto?> UpdateAsync(int id, UpdateProductDto dto)
        {
            var existing = await _repository.GetByIdAsync(id);
            if (existing == null) return null;
            
            if (dto.Name != null) existing.Name = dto.Name;
            if (dto.Description != null) existing.Description = dto.Description;
            if (dto.Price.HasValue) existing.Price = dto.Price.Value;
            if (dto.ImageUrl != null) existing.ImageUrl = dto.ImageUrl;
            if (dto.Stock.HasValue) existing.Stock = dto.Stock.Value;
            if (dto.Category != null) existing.Category = dto.Category;
            if (dto.IsFeatured.HasValue) existing.IsFeatured = dto.IsFeatured.Value;
            
            var updated = await _repository.UpdateAsync(id, existing);
            return updated == null ? null : MapToDto(updated);
        }
        
        public async Task<bool> DeleteAsync(int id)
        {
            return await _repository.DeleteAsync(id);
        }
        
        private static ProductDto MapToDto(Product p)
        {
            return new ProductDto
            {
                ProductId = p.ProductId,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                ImageUrl = p.ImageUrl,
                Stock = p.Stock,
                Category = p.Category,
                IsFeatured = p.IsFeatured
            };
        }
    }
}