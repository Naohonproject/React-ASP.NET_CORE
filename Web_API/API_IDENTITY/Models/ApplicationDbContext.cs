using API_IDENTITY.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API_IDENTITY.Models
{
    public class ApplicationDbContext:IdentityDbContext<MyIdentityUser>
    {
        public ApplicationDbContext(DbContextOptions options) : base(options) { }
    }
}
