using ClockOut.API.Models;

namespace ClockOut.API.Services;

public interface IJwtTokenService
{
    (string Token, DateTime ExpiresAtUtc) GenerateToken(User user);
}
