using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System.Security.Claims;
using server.Models;
using server.Services;

namespace server.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    private readonly MongoDbService _mongoDbService;

    public ProductsController(MongoDbService mongoDbService)
    {
        _mongoDbService = mongoDbService;
    }

    // =====================================================
    // GET ALL PRODUCTS
    // Buyer/Admin can see all products
    // =====================================================

    [HttpGet]
    public async Task<IActionResult> GetProducts()
    {
        var products = await _mongoDbService.Products
            .Find(_ => true)
            .SortByDescending(p => p.CreatedAt)
            .ToListAsync();

        return Ok(products);
    }

    // =====================================================
    // GET MY PRODUCTS
    // Seller can see only their own products
    // GET: api/products/my
    // =====================================================

    [Authorize(Roles = "Seller")]
    [HttpGet("my")]
    public async Task<IActionResult> GetMyProducts()
    {
        var sellerId = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (string.IsNullOrEmpty(sellerId))
        {
            return Unauthorized(new
            {
                message = "Seller is not logged in."
            });
        }

        var products = await _mongoDbService.Products
            .Find(p => p.SellerId == sellerId)
            .SortByDescending(p => p.CreatedAt)
            .ToListAsync();

        return Ok(products);
    }

    // =====================================================
    // GET SINGLE PRODUCT
    // GET: api/products/{id}
    // =====================================================

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProduct(string id)
    {
        var product = await _mongoDbService.Products
            .Find(p => p.Id == id)
            .FirstOrDefaultAsync();

        if (product == null)
        {
            return NotFound(new
            {
                message = "Product not found."
            });
        }

        return Ok(product);
    }

    // =====================================================
    // CREATE PRODUCT
    // POST: api/products
    // =====================================================

    [Authorize(Roles = "Seller")]
    [HttpPost]
    public async Task<IActionResult> CreateProduct(Product product)
    {
        var sellerId = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        var sellerName = User.FindFirstValue(
            ClaimTypes.Name
        );

        if (string.IsNullOrEmpty(sellerId))
        {
            return Unauthorized(new
            {
                message = "Seller is not logged in."
            });
        }

        // Never trust seller information sent from frontend
        product.Id = null;
        product.SellerId = sellerId;
        product.SellerName = sellerName ?? "Seller";
        product.CreatedAt = DateTime.UtcNow;
        product.UpdatedAt = DateTime.UtcNow;

        await _mongoDbService.Products.InsertOneAsync(product);

        return Ok(new
        {
            message = "Product created successfully.",
            product
        });
    }

    // =====================================================
    // UPDATE PRODUCT
    // PUT: api/products/{id}
    // =====================================================

    [Authorize(Roles = "Seller,Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(
        string id,
        Product updatedProduct)
    {
        var existingProduct = await _mongoDbService.Products
            .Find(p => p.Id == id)
            .FirstOrDefaultAsync();

        if (existingProduct == null)
        {
            return NotFound(new
            {
                message = "Product not found."
            });
        }

        var userRole = User.FindFirstValue(
            ClaimTypes.Role
        );

        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        // Seller can update only their own product
        if (
            userRole == "Seller" &&
            existingProduct.SellerId != userId
        )
        {
            return Forbid();
        }

        // Preserve ownership information
        updatedProduct.Id = id;
        updatedProduct.SellerId = existingProduct.SellerId;
        updatedProduct.SellerName = existingProduct.SellerName;
        updatedProduct.CreatedAt = existingProduct.CreatedAt;
        updatedProduct.UpdatedAt = DateTime.UtcNow;

        await _mongoDbService.Products.ReplaceOneAsync(
            p => p.Id == id,
            updatedProduct
        );

        return Ok(new
        {
            message = "Product updated successfully.",
            product = updatedProduct
        });
    }

    // =====================================================
    // DELETE PRODUCT
    // DELETE: api/products/{id}
    // =====================================================

    [Authorize(Roles = "Seller,Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(string id)
    {
        var existingProduct = await _mongoDbService.Products
            .Find(p => p.Id == id)
            .FirstOrDefaultAsync();

        if (existingProduct == null)
        {
            return NotFound(new
            {
                message = "Product not found."
            });
        }

        var userRole = User.FindFirstValue(
            ClaimTypes.Role
        );

        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        // Seller can delete only their own product
        if (
            userRole == "Seller" &&
            existingProduct.SellerId != userId
        )
        {
            return Forbid();
        }

        await _mongoDbService.Products.DeleteOneAsync(
            p => p.Id == id
        );

        return Ok(new
        {
            message = "Product deleted successfully."
        });
    }
}