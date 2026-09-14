using MongoDB.Driver;
using server.Models;

namespace server.Services;

public class MongoDbService
{
    private readonly IMongoDatabase _database;

    public MongoDbService(IConfiguration configuration)
    {
        var connectionString = configuration["MongoDB:ConnectionString"];
        var databaseName = configuration["MongoDB:DatabaseName"];

        var settings = MongoClientSettings.FromConnectionString(connectionString!);

        settings.ServerSelectionTimeout = TimeSpan.FromSeconds(10);
        settings.ConnectTimeout = TimeSpan.FromSeconds(10);

        var client = new MongoClient(settings);

        _database = client.GetDatabase(databaseName);
    }

    public IMongoDatabase Database => _database;

    public IMongoCollection<User> Users
    {
        get
        {
            return _database.GetCollection<User>("users");
        }
    }

    public IMongoCollection<Product> Products
    {
        get
        {
            return _database.GetCollection<Product>("products");
        }
    }
    
public IMongoCollection<Order> Orders
{
    get
    {
        return _database.GetCollection<Order>("orders");
    }
}


}