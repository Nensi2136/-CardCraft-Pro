using Ocelot.DependencyInjection;// Needed for AddOcelot()
using Ocelot.Middleware;// Needed for UseOcelot()
using MMLib.SwaggerForOcelot.DependencyInjection; // Needed for AddSwaggerForOcelot()
using MMLib.SwaggerForOcelot.Middleware; // Needed for UseSwaggerForOcelotUI()

var builder = WebApplication.CreateBuilder(args);

// --- Configuration Setup ---
builder.Configuration.AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);

// Add CORS
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

// Add services to the container.

builder.Services.AddOcelot(builder.Configuration);

builder.Services.AddSwaggerForOcelot(builder.Configuration);

builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwaggerForOcelotUI(opt =>
    {
        opt.PathToSwaggerGenerator = "/swagger/docs";
    });
}

// Use CORS before Ocelot
app.UseCors("AllowReactApp");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

await app.UseOcelot();

app.Run();