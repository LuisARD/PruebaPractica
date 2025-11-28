using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiBackend.AuthServices
{
    public class Usuario
    {
     public int Id { get; set; }
     public string Username { get; set; } = null!;
     public string PasswordHash { get; set; } = null!;
     public string Rol { get; set; } = "User";
    }
}