using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using User_Service.Data;
using User_Service.Data.Interfaces;
using User_Service.Data.Repositories;
using User_Service.Services.Implementations;
using User_Service.Services.Interfaces;
using AutoMapper;
using User_Service.Mapping;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:5174", "http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Configure DbContext
builder.Services.AddDbContext<UserDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();

// Register services
builder.Services.AddScoped<IUserService, UserService>();

// Register AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);

// Register generic repository
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

// Configure Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo 
    { 
        Title = "User Service API", 
        Version = "v1",
        Description = "API for managing users in the Card Printing System"
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "User Service v1"));
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("AllowReactApp");
app.UseAuthorization();

app.MapControllers();

app.Run();
