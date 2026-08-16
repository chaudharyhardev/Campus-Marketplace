using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using server.Models;
using server.Services;

namespace server.Controllers;

[ApiController]
[Route("api/admin")]
public class AdminController : ControllerBase
{
    private readonly MongoDbService _mongoDbService;
    private readonly PasswordHasher<User> _passwordHasher;

    public AdminController(MongoDbService mongoDbService)
    {
        _mongoDbService = mongoDbService;
        _passwordHasher = new PasswordHasher<User>();
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateAdmin()
    {
        var existingAdmin = await _mongoDbService.Users
            .Find(u => u.Role == "Admin")
            .FirstOrDefaultAsync();

        if (existingAdmin != null)
        {
            return BadRequest(new
            {
                message = "Admin already exists."
            });
        }

        var admin = new User
        {
            Name = "System Admin",
            Email = "admin@campusmarketplace.com",
            Role = "Admin"
        };

        admin.PasswordHash = _passwordHasher.HashPassword(
            admin,
            "Admin@12345"
        );

        await _mongoDbService.Users.InsertOneAsync(admin);

        return Ok(new
        {
            message = "Admin created successfully."
        });
    }

    [HttpGet("dashboard")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
    public IActionResult Dashboard()
    {
        return Ok(new
        {
            message = "Welcome to the Admin Dashboard!"
        });
    }
}