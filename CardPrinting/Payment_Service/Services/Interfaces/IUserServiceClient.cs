namespace Payment_Service.Services.Interfaces
{
    public interface IUserServiceClient
    {
        Task<bool> UserExistsAsync(int userId, CancellationToken cancellationToken = default);
    }
}
