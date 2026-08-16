using Microsoft.AspNetCore.Identity;
using MongoDB.Driver;
using server.Models;

namespace server.Services;

public static class AdminSeeder
{
    public static async Task SeedAsync(MongoDbService mongoDbService)
    {
        var existingAdmin = await mongoDbService.Users
            .Find(u => u.Role == "Admin")
            .FirstOrDefaultAsync();

        if (existingAdmin != null)
        {
            Console.WriteLine("Admin already exists.");
            return;
        }

        var admin = new User
        {
            Name = "System Admin",
            Email = "admin@campusmarketplace.com",
            Role = "Admin"
        };

        var passwordHasher = new PasswordHasher<User>();

        admin.PasswordHash = passwordHasher.HashPassword(
            admin,
            "Admin@12345"
        );

        await mongoDbService.Users.InsertOneAsync(admin);

        Console.WriteLine("Admin account created.");
    }
}