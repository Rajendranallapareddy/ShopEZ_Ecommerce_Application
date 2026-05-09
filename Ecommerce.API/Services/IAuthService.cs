using ECommerce.API.Models;
using ECommerce.API.DTOs;

namespace ECommerce.API.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
        Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto);
        string GenerateJwtToken(User user);
        Task<bool> ValidateTokenAsync(string token);
        Task<User?> GetUserFromTokenAsync(string token);
    }
}