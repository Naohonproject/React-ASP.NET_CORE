using API_IDENTITY.Auth;
using API_IDENTITY.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace API_IDENTITY.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly SignInManager<MyIdentityUser> signInManager;
        private readonly UserManager<MyIdentityUser> userManager;

        public AuthController(SignInManager<MyIdentityUser> signInManager, UserManager<MyIdentityUser> userManager)
        {
            this.signInManager = signInManager;
            this.userManager = userManager;
        }

        [HttpPost]
        [Route("Register")]
        public async Task<IActionResult> Register([FromBody] UserDetails userDetails)
        {
            if (!ModelState.IsValid || userDetails == null)
            {
                return new BadRequestObjectResult(new { Message = "User Registration Failed" });
            }

            var identityUser = new MyIdentityUser() { Email = userDetails.Email, UserName = userDetails.UserName };
            var result = await userManager.CreateAsync(identityUser, userDetails.Password);

            if (!result.Succeeded)
            {
                var dictionary = new ModelStateDictionary();
                foreach (IdentityError error in result.Errors)
                {
                    dictionary.AddModelError(error.Code, error.Description);
                }
                return new BadRequestObjectResult(new { Message = "User Registration Failed", Error = dictionary });
            }
            return Ok(new { Message = "User Registration successfully" });
        }

        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> Login([FromBody] LoginCredentials loginCredentials)
        {
            if (!ModelState.IsValid || loginCredentials == null)
            {
                return new BadRequestObjectResult(new { Messsage = "Login Fail" });
            }
            var identityUser = await userManager.FindByNameAsync(loginCredentials.Username);
            if (identityUser == null)
            {
                return new BadRequestObjectResult(new { Message = "Login Fail" });
            }
            var result = userManager.PasswordHasher.VerifyHashedPassword(identityUser, identityUser.PasswordHash, loginCredentials.Password);
            if (result == PasswordVerificationResult.Failed)
            {
                return new BadRequestObjectResult(new { Message = "Login Fail" });
            }

            var claims = new List<Claim> { new Claim(ClaimTypes.Email, identityUser.Email), new Claim(ClaimTypes.Name, identityUser.UserName) };

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity));
            return Ok(new { Message = "You are Logged in Successfully" });
        }

        [HttpPost]
        [Route("Logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok(new { Message = "You are logged out" });
        }
    }
}
