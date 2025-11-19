using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiBackend.Models
{
    public class DetalleVenta
    { //Esta clase corresponde al total y listas de Productos
                public int Id { get; set; }

        public int VentaId { get; set; }
        public Venta Venta { get; set; } = null!;

        public int ProductoId { get; set; }
        public Producto Producto { get; set; } = null!;

        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
        public decimal Subtotal { get; set; }
    }
}