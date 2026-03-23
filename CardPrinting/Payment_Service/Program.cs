using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Payment_Service.Data;
using Payment_Service.Services.Implementations;
using Payment_Service.Services.Interfaces;
using Payment_Service.Mapping;
using Payment_Service.Models;
using Payment_Service.Data.Interfaces;
using Payment_Service.Data.Repositories;
using Stripe;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure DbContext
builder.Services.AddDbContext<PaymentDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register services
builder.Services.AddScoped<IPaymentService, PaymentService>();

// Register AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);

// Register generic repository
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

// Service-to-service communication via ApiGateway
builder.Services.AddHttpClient<IUserServiceClient, UserServiceClient>(client =>
{
    var baseUrl = builder.Configuration["ApiGateway:BaseUrl"];
    if (string.IsNullOrWhiteSpace(baseUrl))
    {
        throw new InvalidOperationException("ApiGateway:BaseUrl is not configured.");
    }

    client.BaseAddress = new Uri(baseUrl);
});

// Configure Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo 
    { 
        Title = "Payment Service API", 
        Version = "v1",
        Description = "API for handling payments in the Card Printing System"
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Payment Service v1"));
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthorization();

app.MapControllers();

app.Run();
