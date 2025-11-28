using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace ApiBackend.Models
{//Aqui se representa los datos que se manejan en la tabla Producto y su relacion con DetallesVenta
    public class Producto
    {
         public int Id { get; set; } // PK
        public string Nombre { get; set; } = null!;
        public string? Descripcion { get; set; }
        public decimal Precio { get; set; }
        public int Stock { get; set; }

        // Relación con DetalleVenta
       [JsonIgnore]
        public ICollection<DetalleVenta> DetallesVenta { get; set; } = new List<DetalleVenta>();
    }
}