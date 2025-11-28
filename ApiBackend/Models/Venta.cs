using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json.Serialization;

namespace ApiBackend.Models
{ //Aqui se representa los datos que se manejan en la tabla Ventas y su relacion con clientes y detalles
    public class Venta
    {
         public int Id { get; set; } // PK
        public DateTime Fecha { get; set; }
        public decimal Total { get; set; }

        // Cliente
        public int ClienteId { get; set; }

        [JsonIgnore] //Prueba para datos requeridos en el api
        public Cliente? Cliente { get; set; }

        // Lista de productos
        public ICollection<DetalleVenta> Detalles { get; set; } = new List<DetalleVenta>();
    }
}