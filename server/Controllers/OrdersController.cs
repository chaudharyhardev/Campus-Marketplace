
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using server.Models;
using server.Services;
using System.Security.Claims;

namespace server.Controllers;

[ApiController]
[Route("api/orders")]
public class OrdersController : ControllerBase
{
    private readonly MongoDbService _mongoDbService;

    public OrdersController(MongoDbService mongoDbService)
    {
        _mongoDbService = mongoDbService;
    }

    // =====================================================
    // BUYER - CREATE ORDER
    // =====================================================

    [Authorize(Roles = "Buyer")]
    [HttpPost]
    public async Task<IActionResult> CreateOrder(Order order)
    {
        var buyerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var buyerName = User.FindFirstValue(ClaimTypes.Name);

        if (string.IsNullOrEmpty(buyerId))
        {
            return Unauthorized(new
            {
                message = "Buyer is not logged in."
            });
        }

        order.Id = null;
        order.BuyerId = buyerId;
        order.BuyerName = buyerName ?? "Buyer";
        order.Status = "Pending";
        order.CreatedAt = DateTime.UtcNow;
        order.UpdatedAt = DateTime.UtcNow;

        await _mongoDbService.Orders.InsertOneAsync(order);

        return Ok(new
        {
            message = "Order created successfully.",
            order
        });
    }

    // =====================================================
    // BUYER - MY ORDERS
    // GET: /api/orders
    // =====================================================

    [Authorize(Roles = "Buyer")]
    [HttpGet]
    public async Task<IActionResult> GetMyOrders()
    {
        var buyerId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(buyerId))
        {
            return Unauthorized(new
            {
                message = "Buyer is not logged in."
            });
        }

        var orders = await _mongoDbService.Orders
            .Find(o => o.BuyerId == buyerId)
            .SortByDescending(o => o.CreatedAt)
            .ToListAsync();

        return Ok(orders);
    }

    // =====================================================
    // SELLER - MY ORDERS
    // GET: /api/orders/seller
    // =====================================================

    [Authorize(Roles = "Seller")]
    [HttpGet("seller")]
    public async Task<IActionResult> GetSellerOrders()
    {
        var sellerId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(sellerId))
        {
            return Unauthorized(new
            {
                message = "Seller is not logged in."
            });
        }

        // Get all orders
        var allOrders = await _mongoDbService.Orders
            .Find(_ => true)
            .SortByDescending(o => o.CreatedAt)
            .ToListAsync();

        // Keep only orders containing this seller's products
        var sellerOrders = allOrders
            .Where(order =>
                order.Items != null &&
                order.Items.Any(item => item.SellerId == sellerId)
            )
            .Select(order =>
            {
                // Only return this seller's products
                order.Items = order.Items?
                    .Where(item => item.SellerId == sellerId)
                    .ToList()
                    ?? new List<OrderItem>();

                return order;
            })
            .ToList();

        return Ok(sellerOrders);
    }

    // =====================================================
    // ADMIN - ALL ORDERS
    // GET: /api/orders/admin
    // =====================================================

    [Authorize(Roles = "Admin")]
    [HttpGet("admin")]
    public async Task<IActionResult> GetAllOrders()
    {
        var orders = await _mongoDbService.Orders
            .Find(_ => true)
            .SortByDescending(o => o.CreatedAt)
            .ToListAsync();

        return Ok(orders);
    }

    // =====================================================
    // ADMIN - UPDATE ORDER STATUS
    // PUT: /api/orders/{id}/status
    // =====================================================

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateOrderStatus(
        string id,
        [FromBody] StatusRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Status))
        {
            return BadRequest(new
            {
                message = "Status is required."
            });
        }

        var allowedStatuses = new[]
        {
            "Pending",
            "Confirmed",
            "Shipped",
            "Delivered",
            "Cancelled"
        };

        if (!allowedStatuses.Contains(request.Status))
        {
            return BadRequest(new
            {
                message = "Invalid order status."
            });
        }

        var order = await _mongoDbService.Orders
            .Find(o => o.Id == id)
            .FirstOrDefaultAsync();

        if (order == null)
        {
            return NotFound(new
            {
                message = "Order not found."
            });
        }

        var update = Builders<Order>.Update
            .Set(o => o.Status, request.Status)
            .Set(o => o.UpdatedAt, DateTime.UtcNow);

        await _mongoDbService.Orders.UpdateOneAsync(
            o => o.Id == id,
            update
        );

        return Ok(new
        {
            message = "Order status updated successfully.",
            status = request.Status
        });
    }

    // =====================================================
    // GET SINGLE ORDER
    // BUYER / SELLER / ADMIN
    //
    // GET: /api/orders/{id}
    // =====================================================

    [Authorize(Roles = "Buyer,Seller,Admin")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetOrder(string id)
    {
        var order = await _mongoDbService.Orders
            .Find(o => o.Id == id)
            .FirstOrDefaultAsync();

        if (order == null)
        {
            return NotFound(new
            {
                message = "Order not found."
            });
        }

        var role = User.FindFirstValue(ClaimTypes.Role);
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        // =================================================
        // ADMIN
        // =================================================

        if (role == "Admin")
        {
            return Ok(order);
        }

        // =================================================
        // BUYER
        // =================================================

        if (role == "Buyer")
        {
            if (order.BuyerId != userId)
            {
                return Forbid();
            }

            return Ok(order);
        }

        // =================================================
        // SELLER
        // =================================================

        if (role == "Seller")
        {
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new
                {
                    message = "Seller is not logged in."
                });
            }

            var sellerOwnsProduct =
                order.Items != null &&
                order.Items.Any(item => item.SellerId == userId);

            if (!sellerOwnsProduct)
            {
                return Forbid();
            }

            // Only return this seller's products
            order.Items = order.Items?
                .Where(item => item.SellerId == userId)
                .ToList()
                ?? new List<OrderItem>();

            return Ok(order);
        }

        return Forbid();
    }
}

// =========================================================
// STATUS REQUEST
// =========================================================

public class StatusRequest
{
    public string Status { get; set; } = string.Empty;
}

