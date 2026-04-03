using ClockOut.API.Data;
using ClockOut.API.DTOs.Auth;
using ClockOut.API.DTOs.Users;
using ClockOut.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClockOut.API.Controllers;

[Authorize]
[Route("api/me")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly ClockOutAPIContext _context;

    public UsersController(ClockOutAPIContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<UserSummaryResponse>> GetMe()
    {
        var userId = User.GetRequiredUserId();
        var user = await _context.User.SingleOrDefaultAsync(u => u.Id == userId);
        if (user is null)
        {
            return NotFound();
        }

        return Ok(ToUserSummary(user));
    }

    [HttpPut]
    public async Task<ActionResult<UserSummaryResponse>> UpdateMe(UpdateMeRequest request)
    {
        var userId = User.GetRequiredUserId();
        var user = await _context.User.SingleOrDefaultAsync(u => u.Id == userId);
        if (user is null)
        {
            return NotFound();
        }

        user.FirstName = request.FirstName.Trim();
        user.LastName = request.LastName.Trim();
        user.RequiredHours = request.RequiredHours;

        await _context.SaveChangesAsync();

        return Ok(ToUserSummary(user));
    }

    private static UserSummaryResponse ToUserSummary(Models.User user)
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
