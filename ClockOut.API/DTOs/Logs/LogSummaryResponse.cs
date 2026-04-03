namespace ClockOut.API.DTOs.Logs;

public sealed class LogSummaryResponse
{
    public int RequiredHours { get; set; }
    public double TotalHoursLogged { get; set; }
    public double RemainingHours { get; set; }
    public double PercentComplete { get; set; }
    public int EntryCount { get; set; }
}
