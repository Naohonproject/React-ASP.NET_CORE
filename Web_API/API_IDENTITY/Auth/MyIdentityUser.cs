using Microsoft.AspNetCore.Identity;

namespace API_IDENTITY.Auth
{
    public class MyIdentityUser:IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
