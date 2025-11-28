using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApiBackend.Models;
using ApiBackend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace ApiBackend.AuthServices
{
[AllowAnonymous]
[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    public AuthController(AppDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }
    //Controlador del Registro
    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        // ¿Ya existe el usuario?
        if (_context.Usuarios.Any(u => u.Username == dto.Username))
        {
            return BadRequest("El nombre de usuario ya existe.");
        }

        var usuario = new Usuario
        {
            Username = dto.Username,
            PasswordHash = PasswordHelper.HashPassword(dto.Password),
            Rol = "Admin" //define a todo los nuevos usuarios con el mismo rol
        };

        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();

        return Ok("Usuario registrado correctamente.");
    }
    //Controlador de Login, esta parte del api que hace los respectivos llamados y validaciones con la BD.
    [HttpPost("login")]
    [AllowAnonymous]
    public IActionResult Login(LoginDto dto)
    {
        var usuario = _context.Usuarios.FirstOrDefault(u => u.Username == dto.Username);
        if (usuario == null)
        {
            return Unauthorized("Usuario o contraseña incorrectos.");
        }

        if (!PasswordHelper.VerifyPassword(dto.Password, usuario.PasswordHash))
        {
            return Unauthorized("Usuario o contraseña incorrectos.");
        }
    
        var jwtSettings = _config.GetSection("Jwt");
        var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, usuario.Username),
            new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
            new Claim(ClaimTypes.Role, usuario.Rol)
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(double.Parse(jwtSettings["ExpireMinutes"]!)),
            Issuer = jwtSettings["Issuer"],
            Audience = jwtSettings["Audience"],
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature
            )
        };
        //Token para autenficaciones. Te permite acceder a las partes bloqueadas del sistema
        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        var jwt = tokenHandler.WriteToken(token);

        return Ok(new { token = jwt });
    }
}
}