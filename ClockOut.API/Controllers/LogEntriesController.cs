using ClockOut.API.Data;
using ClockOut.API.DTOs.Logs;
using ClockOut.API.Models;
using ClockOut.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClockOut.API.Controllers;

[Authorize]
[Route("api/logs")]
[ApiController]
public class LogEntriesController : ControllerBase
{
    private readonly ClockOutAPIContext _context;

    public LogEntriesController(ClockOutAPIContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<LogEntryResponse>>> GetMyLogs()
    {
        var userId = User.GetRequiredUserId();
        var logs = await _context.LogEntry
            .Where(l => l.UserId == userId)
            .OrderByDescending(l => l.Date)
            .ThenByDescending(l => l.CreatedAt)
            .Select(l => ToLogEntryResponse(l))
            .ToListAsync();

        return Ok(logs);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<LogEntryResponse>> GetMyLogById(int id)
    {
        var userId = User.GetRequiredUserId();
        var log = await _context.LogEntry
            .Where(l => l.Id == id && l.UserId == userId)
            .Select(l => ToLogEntryResponse(l))
            .SingleOrDefaultAsync();

        if (log is null)
        {
            return NotFound();
        }

        return Ok(log);
    }

    [HttpPost]
    public async Task<ActionResult<LogEntryResponse>> CreateMyLog(CreateLogEntryRequest request)
    {
        var userId = User.GetRequiredUserId();
        var utcNow = DateTime.UtcNow;

        var logEntry = new LogEntry
        {
            UserId = userId,
            Date = request.Date,
            HoursRendered = request.HoursRendered,
            TaskDescription = request.TaskDescription.Trim(),
            SupervisorName = request.SupervisorName.Trim(),
            CreatedAt = utcNow,
            UpdatedAt = utcNow
        };

        _context.LogEntry.Add(logEntry);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetMyLogById), new { id = logEntry.Id }, ToLogEntryResponse(logEntry));
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<LogEntryResponse>> UpdateMyLog(int id, UpdateLogEntryRequest request)
    {
        var userId = User.GetRequiredUserId();
        var logEntry = await _context.LogEntry.SingleOrDefaultAsync(l => l.Id == id && l.UserId == userId);
        if (logEntry is null)
        {
            return NotFound();
        }

        logEntry.Date = request.Date;
        logEntry.HoursRendered = request.HoursRendered;
        logEntry.TaskDescription = request.TaskDescription.Trim();
        logEntry.SupervisorName = request.SupervisorName.Trim();
        logEntry.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(ToLogEntryResponse(logEntry));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteMyLog(int id)
    {
        var userId = User.GetRequiredUserId();
        var logEntry = await _context.LogEntry.SingleOrDefaultAsync(l => l.Id == id && l.UserId == userId);
        if (logEntry is null)
        {
            return NotFound();
        }

        _context.LogEntry.Remove(logEntry);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("summary")]
    public async Task<ActionResult<LogSummaryResponse>> GetMySummary()
    {
        var userId = User.GetRequiredUserId();
        var user = await _context.User.SingleOrDefaultAsync(u => u.Id == userId);
        if (user is null)
        {
            return NotFound();
        }

        var entryCount = await _context.LogEntry.CountAsync(l => l.UserId == userId);
        var totalHours = await _context.LogEntry
            .Where(l => l.UserId == userId)
            .SumAsync(l => (double?)l.HoursRendered) ?? 0;

        var remainingHours = Math.Max(0, user.RequiredHours - totalHours);
        var percentComplete = user.RequiredHours <= 0
            ? 0
            : Math.Min(100, (totalHours / user.RequiredHours) * 100);

        return Ok(new LogSummaryResponse
        {
            RequiredHours = user.RequiredHours,
            TotalHoursLogged = Math.Round(totalHours, 2),
            RemainingHours = Math.Round(remainingHours, 2),
            PercentComplete = Math.Round(percentComplete, 2),
            EntryCount = entryCount
        });
    }

    private static LogEntryResponse ToLogEntryResponse(LogEntry logEntry)
    {
        return new LogEntryResponse
        {
            Id = logEntry.Id,
            Date = logEntry.Date,
            HoursRendered = logEntry.HoursRendered,
            TaskDescription = logEntry.TaskDescription,
            SupervisorName = logEntry.SupervisorName,
            CreatedAt = logEntry.CreatedAt,
            UpdatedAt = logEntry.UpdatedAt
        };
    }
}
