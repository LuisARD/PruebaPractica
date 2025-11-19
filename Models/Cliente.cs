using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiBackend.Models
{
    public class Cliente
    {
         public int Id { get; set; } // PK
        public string Nombre { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Telefono { get; set; } = null!;

        public ICollection<Venta> Ventas { get; set; } = new List<Venta>();
    }
}