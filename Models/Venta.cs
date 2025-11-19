using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiBackend.Models
{
    public class Venta
    {
         public int Id { get; set; } // PK
        public DateTime Fecha { get; set; }
        public decimal Total { get; set; }

        // Cliente
        public int ClienteId { get; set; }
        public Cliente Cliente { get; set; } = null!;

        // Lista de productos (a través de tabla intermedia)
        public ICollection<DetalleVenta> Detalles { get; set; } = new List<DetalleVenta>();
    }
}