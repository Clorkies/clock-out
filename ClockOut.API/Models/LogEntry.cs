namespace ClockOut.API.Models;

public class LogEntry
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public DateOnly Date { get; set; }
    public double HoursRendered { get; set; }
    public string TaskDescription { get; set; } = string.Empty;
    public string SupervisorName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

}
