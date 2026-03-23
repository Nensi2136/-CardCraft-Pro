using System.Net;
using Payment_Service.Services.Interfaces;

namespace Payment_Service.Services.Implementations
{
    public class UserServiceClient : IUserServiceClient
    {
        private readonly HttpClient _httpClient;

        public UserServiceClient(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<bool> UserExistsAsync(int userId, CancellationToken cancellationToken = default)
        {
            using var response = await _httpClient.GetAsync($"/api/users/{userId}", cancellationToken);

            if (response.StatusCode == HttpStatusCode.NotFound)
            {
                return false;
            }

            if (response.IsSuccessStatusCode)
            {
                return true;
            }

            var body = await response.Content.ReadAsStringAsync(cancellationToken);
            throw new HttpRequestException($"User service request failed with status {(int)response.StatusCode} ({response.ReasonPhrase}). Body: {body}");
        }
    }
}
