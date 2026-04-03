using System.ComponentModel.DataAnnotations;

namespace ClockOut.API.DTOs.Users;

public sealed class UpdateMeRequest
{
    [Required]
    [MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string LastName { get; set; } = string.Empty;

    [Range(1, 5000)]
    public int RequiredHours { get; set; } = 300;
}
