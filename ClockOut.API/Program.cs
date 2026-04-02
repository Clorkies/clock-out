using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using ClockOut.API.Data;
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<ClockOutAPIContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("ClockOutAPIContext") ?? throw new InvalidOperationException("Connection string 'ClockOutAPIContext' not found.")));

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
