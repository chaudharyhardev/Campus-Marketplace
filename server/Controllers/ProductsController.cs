
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
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

    // GET: api/products
    [HttpGet]
    public async Task<IActionResult> GetProducts()
    {
        var products = await _mongoDbService.Products
            .Find(_ => true)
            .SortByDescending(p => p.CreatedAt)
            .ToListAsync();

        return Ok(products);
    }

    // GET: api/products/{id}
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

    // POST: api/products
    [HttpPost]
    public async Task<IActionResult> CreateProduct(Product product)
    {
        product.Id = null;
        product.CreatedAt = DateTime.UtcNow;
        product.UpdatedAt = DateTime.UtcNow;

        await _mongoDbService.Products.InsertOneAsync(product);

        return Ok(new
        {
            message = "Product created successfully.",
            product
        });
    }

    // PUT: api/products/{id}
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

        updatedProduct.Id = id;
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

    // DELETE: api/products/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(string id)
    {
        var result = await _mongoDbService.Products
            .DeleteOneAsync(p => p.Id == id);

        if (result.DeletedCount == 0)
        {
            return NotFound(new
            {
                message = "Product not found."
            });
        }

        return Ok(new
        {
            message = "Product deleted successfully."
        });
    }
}

