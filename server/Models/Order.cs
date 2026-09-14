
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace server.Models;

[BsonIgnoreExtraElements]
public class Order
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("buyerId")]
    public string BuyerId { get; set; } = string.Empty;

    [BsonElement("buyerName")]
    public string BuyerName { get; set; } = string.Empty;

    [BsonElement("fullName")]
    public string FullName { get; set; } = string.Empty;

    [BsonElement("address")]
    public string Address { get; set; } = string.Empty;

    [BsonElement("phone")]
    public string Phone { get; set; } = string.Empty;

    [BsonElement("items")]
    public List<OrderItem> Items { get; set; } = new();

    [BsonElement("totalAmount")]
    public decimal TotalAmount { get; set; }

    [BsonElement("status")]
    public string Status { get; set; } = "Pending";

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}


[BsonIgnoreExtraElements]
public class OrderItem
{
    [BsonElement("productId")]
    public string ProductId { get; set; } = string.Empty;

    [BsonElement("productName")]
    public string ProductName { get; set; } = string.Empty;

    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("sellerId")]
    public string SellerId { get; set; } = string.Empty;

    [BsonElement("sellerName")]
    public string SellerName { get; set; } = string.Empty;

    [BsonElement("price")]
    public decimal Price { get; set; }

    [BsonElement("quantity")]
    public int Quantity { get; set; }

    [BsonElement("imageUrl")]
    public string ImageUrl { get; set; } = string.Empty;
}

