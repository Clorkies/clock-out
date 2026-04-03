using System.ComponentModel.DataAnnotations;

namespace ClockOut.API.DTOs.Logs;

public sealed class UpdateLogEntryRequest
{
    [Required]
    public DateOnly Date { get; set; }

    [Range(0.1, 24)]
    public double HoursRendered { get; set; }

    [Required]
    [MaxLength(1000)]
    public string TaskDescription { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    public string SupervisorName { get; set; } = string.Empty;
}
