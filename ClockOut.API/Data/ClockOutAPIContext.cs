using Microsoft.EntityFrameworkCore;
using ClockOut.API.Models;

namespace ClockOut.API.Data
{
    public class ClockOutAPIContext : DbContext
    {
        public ClockOutAPIContext (DbContextOptions<ClockOutAPIContext> options)
            : base(options)
        {
        }

        public DbSet<ClockOut.API.Models.LogEntry> LogEntry { get; set; } = default!;
        public DbSet<ClockOut.API.Models.User> User { get; set; } = default!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();
        }
    }
}
