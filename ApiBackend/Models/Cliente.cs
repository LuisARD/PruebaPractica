using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiBackend.Models
{ //Aqui se representa los datos que se manejan en la tabla clientes y su relacion con Ventas
    public class Cliente
    {
         public int Id { get; set; } // PK
        public string Nombre { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Telefono { get; set; } = null!;

        public ICollection<Venta> Ventas { get; set; } = new List<Venta>();
    }
}