using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiBackend.Models.DTO
{  
    //Tiene como funcion manejar los datos consultar Producto y Clientes para extraer datos en vez de manejarlo nuevamente en el apartado de DetalleVenta
    public class DtoDetalleVenta
    {
        public int ProductoId { get; set; }
        public int Cantidad {get; set;}
    }

    public class VentaDto
    {
        public DateTime Fecha {get; set;}
        public int ClienteId { get; set; }

        public List <DtoDetalleVenta> Detalles {get; set; } = new();
    }
}