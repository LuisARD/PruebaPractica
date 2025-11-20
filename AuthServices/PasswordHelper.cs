using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text;

namespace ApiBackend.AuthServices
{
    public static class PasswordHelper
    {
         public static string HashPassword(string password)
    {
        // Para demo: usa SHA256 (no es ideal para production, pero sirve para el proyecto)
        using var sha = System.Security.Cryptography.SHA256.Create();
        var bytes = Encoding.UTF8.GetBytes(password);
        var hash = sha.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
    }

    public static bool VerifyPassword(string password, string hash)
    {
        return HashPassword(password) == hash;
    }
    }
}