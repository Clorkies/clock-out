using ClockOut.API.Data;
using ClockOut.API.DTOs.Auth;
using ClockOut.API.Models;
using ClockOut.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClockOut.API.Controllers;

[Route("api/auth")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly ClockOutAPIContext _context;
    private readonly IPasswordService _passwordService;
    private readonly IJwtTokenService _jwtTokenService;

    public AuthController(
        ClockOutAPIContext context,
        IPasswordService passwordService,
        IJwtTokenService jwtTokenService)
    {
        _context = context;
        _passwordService = passwordService;
        _jwtTokenService = jwtTokenService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var emailExists = await _context.User.AnyAsync(u => u.Email.ToLower() == email);
        if (emailExists)
        {
            return Conflict(new ProblemDetails
            {
                Title = "Email already registered",
                Detail = "An account with this email address already exists.",
                Status = StatusCodes.Status409Conflict
            });
        }

        var user = new User
        {
            Email = email,
            PasswordHash = _passwordService.HashPassword(request.Password),
            FirstName = request.FirstName.Trim(),
            LastName = request.LastName.Trim()
        };

        _context.User.Add(user);
        await _context.SaveChangesAsync();

        var (token, expiresAtUtc) = _jwtTokenService.GenerateToken(user);

        return Ok(new AuthResponse
        {
            AccessToken = token,
            ExpiresAtUtc = expiresAtUtc,
            User = ToUserSummary(user)
        });
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var user = await _context.User.SingleOrDefaultAsync(u => u.Email.ToLower() == email);
        if (user is null || !_passwordService.VerifyPassword(request.Password, user.PasswordHash))
        {
            return Unauthorized(new ProblemDetails
            {
                Title = "Invalid credentials",
                Detail = "Email or password is incorrect.",
                Status = StatusCodes.Status401Unauthorized
            });
        }

        var (token, expiresAtUtc) = _jwtTokenService.GenerateToken(user);

        return Ok(new AuthResponse
        {
            AccessToken = token,
            ExpiresAtUtc = expiresAtUtc,
            User = ToUserSummary(user)
        });
    }

    private static UserSummaryResponse ToUserSummary(User user)
    {
        return new UserSummaryResponse
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            RequiredHours = user.RequiredHours,
            CreatedAt = user.CreatedAt
        };
    }
}
