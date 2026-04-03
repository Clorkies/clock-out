namespace ClockOut.API.DTOs.Logs;

public sealed class LogEntryResponse
{
    public int Id { get; set; }
    public DateOnly Date { get; set; }
    public double HoursRendered { get; set; }
    public string TaskDescription { get; set; } = string.Empty;
    public string SupervisorName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
