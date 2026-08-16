using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using server.Services;

namespace server.Controllers;

[ApiController]
[Route("api")]
public class MongoTestController : ControllerBase
{
    private readonly MongoDbService _mongoDbService;

    public MongoTestController(MongoDbService mongoDbService)
    {
        _mongoDbService = mongoDbService;
    }

    [HttpGet("mongo-test")]
    public async Task<IActionResult> TestConnection()
    {
        await _mongoDbService.Database
            .RunCommandAsync<MongoDB.Bson.BsonDocument>(
                new MongoDB.Bson.BsonDocument("ping", 1)
            );

        return Ok(new
        {
            message = "MongoDB connected successfully!",
            database = "CampusMarketplace"
        });
    }

    [HttpGet("mongo-users-test")]
    public async Task<IActionResult> TestUsers()
    {
        var users = await _mongoDbService.Users
            .Find(_ => true)
            .Limit(1)
            .ToListAsync();

        return Ok(new
        {
            message = "Users collection works!",
            count = users.Count
        });
    }
}