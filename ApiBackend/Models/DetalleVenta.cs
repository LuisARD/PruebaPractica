using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json.Serialization;


namespace ApiBackend.Models
{ //Aqui se representa los datos que se manejan en la tabla DETALLES que corresponde a otro tipo de datos que se enlazan con ventas
    public class DetalleVenta
    { //Esta clase corresponde al total y listas de Productos
         public int Id { get; set; }

        public int VentaId { get; set; }
        [JsonIgnore]
        public Venta? Venta { get; set; }
    
        public int ProductoId { get; set; }
        public Producto? Producto { get; set; } = null!;

        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
        public decimal Subtotal { get; set; }
    }
}