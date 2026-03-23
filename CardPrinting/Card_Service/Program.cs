using Card_Service.Data;
using Card_Service.Data.Interfaces;
using Card_Service.Data.Repositories;
using Card_Service.Mapping;
using Card_Service.Services.Implementations;
using Card_Service.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure DbContext
builder.Services.AddDbContext<CardDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register repositories
builder.Services.AddScoped<ICardTemplateRepository, CardTemplateRepository>();
builder.Services.AddScoped<ITemplateCategoryRepository, TemplateCategoryRepository>();

// Register services 
builder.Services.AddScoped<ICardTemplateService, CardTemplateService>();
builder.Services.AddScoped<ITemplateCategoryService, TemplateCategoryService>();

// Register AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile).Assembly);
// Configure Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Card Service", Version = "v1" });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Card Service v1");
    });
}

app.UseHttpsRedirection();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(@"E:\AAD\PROJECT\templates"),
    RequestPath = "/api/templates/images"
});
app.UseAuthorization();

app.MapControllers();

app.Run();
