using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using server.Models;
using server.Services;

namespace server.Controllers;

[ApiController]
[Route("api/users")]
[Authorize(Roles = "Admin")]
public class UserController : ControllerBase
{
private readonly MongoDbService _mongoDbService;

public UserController(MongoDbService mongoDbService)
{
    _mongoDbService = mongoDbService;
}

// =====================================================
// GET ALL USERS
// GET: api/users
// =====================================================

[HttpGet]
public async Task<IActionResult> GetUsers()
{
    try
    {
        var users = await _mongoDbService.Users
            .Find(_ => true)
            .SortByDescending(u => u.CreatedAt)
            .ToListAsync();

        // Do not send password hashes to frontend
        var result = users.Select(user => new
        {
            id = user.Id,
            name = user.Name,
            email = user.Email,
            role = user.Role,
            createdAt = user.CreatedAt
        });

        return Ok(result);
    }
    catch (Exception ex)
    {
        Console.WriteLine("GET USERS ERROR: " + ex.Message);

        return StatusCode(500, new
        {
            message = "Failed to load users."
        });
    }
}

// =====================================================
// GET USER BY ID
// GET: api/users/{id}
// =====================================================

[HttpGet("{id}")]
public async Task<IActionResult> GetUser(string id)
{
    try
    {
        var user = await _mongoDbService.Users
            .Find(u => u.Id == id)
            .FirstOrDefaultAsync();

        if (user == null)
        {
            return NotFound(new
            {
                message = "User not found."
            });
        }

        return Ok(new
        {
            id = user.Id,
            name = user.Name,
            email = user.Email,
            role = user.Role,
            createdAt = user.CreatedAt
        });
    }
    catch (Exception ex)
    {
        Console.WriteLine("GET USER ERROR: " + ex.Message);

        return StatusCode(500, new
        {
            message = "Failed to load user."
        });
    }
}

// =====================================================
// DELETE USER
// DELETE: api/users/{id}
// =====================================================

[HttpDelete("{id}")]
public async Task<IActionResult> DeleteUser(string id)
{
    try
    {
        var user = await _mongoDbService.Users
            .Find(u => u.Id == id)
            .FirstOrDefaultAsync();

        if (user == null)
        {
            return NotFound(new
            {
                message = "User not found."
            });
        }

        // Prevent admin from deleting an Admin account
        if (user.Role == "Admin")
        {
            return BadRequest(new
            {
                message = "Admin users cannot be deleted."
            });
        }

        var result = await _mongoDbService.Users
            .DeleteOneAsync(u => u.Id == id);

        if (result.DeletedCount == 0)
        {
            return NotFound(new
            {
                message = "User could not be deleted."
            });
        }

        return Ok(new
        {
            message = "User deleted successfully."
        });
    }
    catch (Exception ex)
    {
        Console.WriteLine("DELETE USER ERROR: " + ex.Message);

        return StatusCode(500, new
        {
            message = "Failed to delete user."
        });
    }
}


}
