using System.Security.Claims;

namespace ClockOut.API.Services;

public static class ClaimsPrincipalExtensions
{
    public static int GetRequiredUserId(this ClaimsPrincipal user)
    {
        var claimValue = user.FindFirstValue(ClaimTypes.NameIdentifier) ?? user.FindFirstValue("sub");
        if (!int.TryParse(claimValue, out var userId))
        {
            throw new UnauthorizedAccessException("Missing or invalid user claim.");
        }

        return userId;
    }
}
