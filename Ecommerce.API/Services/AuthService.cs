using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using ECommerce.API.Models;
using ECommerce.API.DTOs;
using ECommerce.API.Repositories;

namespace ECommerce.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;
        
        public AuthService(IUserRepository userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }
        
        public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
        {
            var user = await _userRepository.GetByEmailAsync(loginDto.Email);
            if (user == null)
                return new AuthResponseDto { Success = false, Message = "Invalid email or password" };
            
            // Use BCrypt.Net.BCrypt.Verify
            if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
                return new AuthResponseDto { Success = false, Message = "Invalid email or password" };
            
            var token = GenerateJwtToken(user);
            
            return new AuthResponseDto
            {
                Success = true,
                Message = "Login successful",
                Token = token,
                UserId = user.UserId,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                ExpiresAt = DateTime.UtcNow.AddDays(7)
            };
        }
        
        public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto)
        {
            if (await _userRepository.EmailExistsAsync(registerDto.Email))
                return new AuthResponseDto { Success = false, Message = "Email already exists" };
            
            // Use BCrypt.Net.BCrypt.HashPassword
            var user = new User
            {
                Name = registerDto.Name,
                Email = registerDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                Role = "Customer",
                CreatedAt = DateTime.UtcNow
            };
            
            await _userRepository.CreateAsync(user);
            
            var token = GenerateJwtToken(user);
            
            return new AuthResponseDto
            {
                Success = true,
                Message = "Registration successful",
                Token = token,
                UserId = user.UserId,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                ExpiresAt = DateTime.UtcNow.AddDays(7)
            };
        }
        
        public string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? "ShopEZSuperSecretKey2024!@#$%^&*ABCDEFGHIJK");
            
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Name, user.Name),
                    new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"]
            };
            
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
        
        public async Task<bool> ValidateTokenAsync(string token)
        {
            if (string.IsNullOrEmpty(token))
                return false;
            
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? "ShopEZSuperSecretKey2024!@#$%^&*ABCDEFGHIJK");
                
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = _configuration["Jwt:Issuer"],
                    ValidateAudience = true,
                    ValidAudience = _configuration["Jwt:Audience"],
                    ClockSkew = TimeSpan.Zero,
                    ValidateLifetime = true
                }, out _);
                
                return true;
            }
            catch
            {
                return false;
            }
        }
        
        public async Task<User?> GetUserFromTokenAsync(string token)
        {
            if (string.IsNullOrEmpty(token))
                return null;
            
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var jsonToken = tokenHandler.ReadJwtToken(token);
                
                var userIdClaim = jsonToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
                if (userIdClaim == null)
                    return null;
                
                var userId = int.Parse(userIdClaim.Value);
                return await _userRepository.GetByIdAsync(userId);
            }
            catch
            {
                return null;
            }
        }
    }
}