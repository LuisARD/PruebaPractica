using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApiBackend.Data;
using ApiBackend.Models;
using ApiBackend.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ApiBackend.Controllers
{ // Metodos y llamados que permite crear, borrar, actualizar datos dentro del sistema, en este caso dentro del apartado de ventas.
   [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class VentasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VentasController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Ventas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Venta>>> GetVentas()
        {
            return await _context.Ventas
                .Include(v => v.Cliente)
                .Include(v => v.Detalles)
                    .ThenInclude(d => d.Producto)
                .ToListAsync();
        }

        // GET: api/Ventas/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Venta>> GetVenta(int id)
        {
            var venta = await _context.Ventas
                .Include(v => v.Cliente)
                .Include(v => v.Detalles)
                    .ThenInclude(d => d.Producto)
                .FirstOrDefaultAsync(v => v.Id == id);

            if (venta == null) return NotFound();

            return venta;
        }

        [HttpDelete("{id}")]
public async Task<IActionResult> DeleteVenta(int id)
{
    // Carga la venta incluyendo sus detalles
    var venta = await _context.Ventas
        .Include(v => v.Detalles)
        .FirstOrDefaultAsync(v => v.Id == id);

    if (venta == null)
    {
        return NotFound();
    }

    //  aquí devuelve el stock a los productos
 foreach (var detalle in venta.Detalles)
 {
         var producto = await _context.Productos.FindAsync(detalle.ProductoId);
         if (producto != null) {
             producto.Stock += detalle.Cantidad;
         }
          }

    // Primero removemos los detalles (por claridad, aunque con cascade también vale)
    _context.DetallesVenta.RemoveRange(venta.Detalles);

    // Luego removemos la venta
    _context.Ventas.Remove(venta);

    await _context.SaveChangesAsync();

    return NoContent();
}

        // POST: api/Ventas
        [HttpPost]
        public async Task<ActionResult<Venta>> PostVenta(VentaDto dto)
        {
// Verificar cliente
    var cliente = await _context.Clientes.FindAsync(dto.ClienteId);
    if (cliente == null)
    {
        return BadRequest($"El cliente con ID {dto.ClienteId} no existe.");
    }

    if (dto.Detalles == null || !dto.Detalles.Any())
    {
        return BadRequest("La venta debe tener al menos un detalle.");
    }

    var venta = new Venta
    {
        Fecha = dto.Fecha,
        ClienteId = dto.ClienteId,
        Detalles = new List<DetalleVenta>()
    };

    // Primero validamos todos los productos y stock
    foreach (var detDto in dto.Detalles)
    {
        var producto = await _context.Productos.FindAsync(detDto.ProductoId);
        if (producto == null)
        {
            return BadRequest($"El producto con ID {detDto.ProductoId} no existe.");
        }

        if (detDto.Cantidad <= 0)
        {
            return BadRequest($"La cantidad para el producto {producto.Nombre} debe ser mayor que 0.");
        }

        if (producto.Stock < detDto.Cantidad)
        {
            return BadRequest($"No hay suficiente stock para el producto {producto.Nombre}. Stock actual: {producto.Stock}, solicitado: {detDto.Cantidad}.");
        }
    }

    // Si todo está OK, ahora sí creamos los detalles y descontamos stock
    foreach (var detDto in dto.Detalles)
    {
        var producto = await _context.Productos.FindAsync(detDto.ProductoId);

        // Ya validado que existe y tiene stock
        var precioUnitario = producto!.Precio;

        // Descontar stock
        producto.Stock -= detDto.Cantidad;

        var detalle = new DetalleVenta
        {
            ProductoId = detDto.ProductoId,
            Cantidad = detDto.Cantidad,
            PrecioUnitario = precioUnitario,
            Subtotal = precioUnitario * detDto.Cantidad
        };

        venta.Detalles.Add(detalle);
    }

    // Calcular total de la venta
    venta.Total = venta.Detalles.Sum(d => d.Subtotal);

    _context.Ventas.Add(venta);
    await _context.SaveChangesAsync();

    // Opcional: cargar relaciones para la respuesta
    await _context.Entry(venta).Reference(v => v.Cliente).LoadAsync();
    await _context.Entry(venta).Collection(v => v.Detalles).LoadAsync();
    foreach (var d in venta.Detalles)
    {
        await _context.Entry(d).Reference(x => x.Producto).LoadAsync();
    }

    return CreatedAtAction(nameof(GetVenta), new { id = venta.Id }, venta);
        }

 // PUT: api/Ventas/5
[HttpPut("{id}")]
public async Task<IActionResult> PutVenta(int id, VentaDto dto)
{
    // 1. Buscar la venta existente con sus detalles
    var ventaExistente = await _context.Ventas
        .Include(v => v.Detalles)
        .FirstOrDefaultAsync(v => v.Id == id);

    if (ventaExistente == null)
    {
        return NotFound();
    }

    // 2. Verificar que el cliente exista
    var cliente = await _context.Clientes.FindAsync(dto.ClienteId);
    if (cliente == null)
    {
        return BadRequest($"El cliente con ID {dto.ClienteId} no existe.");
    }

    if (dto.Detalles == null || !dto.Detalles.Any())
    {
        return BadRequest("La venta debe tener al menos un detalle.");
    }

    // 3. Revertir el stock de los productos de la venta anterior
    foreach (var detalleViejo in ventaExistente.Detalles)
    {
        var producto = await _context.Productos.FindAsync(detalleViejo.ProductoId);
        if (producto != null)
        {
            // devolvemos el stock que se había descontado
            producto.Stock += detalleViejo.Cantidad;
        }
    }

    // 4. Borrar los detalles viejos
    _context.DetallesVenta.RemoveRange(ventaExistente.Detalles);
    await _context.SaveChangesAsync(); // guardar cambios de stock + eliminación de detalles

    // 5. Validar stock de los nuevos detalles
    foreach (var detDto in dto.Detalles)
    {
        var producto = await _context.Productos.FindAsync(detDto.ProductoId);
        if (producto == null)
        {
            return BadRequest($"El producto con ID {detDto.ProductoId} no existe.");
        }

        if (detDto.Cantidad <= 0)
        {
            return BadRequest($"La cantidad para el producto {producto.Nombre} debe ser mayor que 0.");
        }

        if (producto.Stock < detDto.Cantidad)
        {
            return BadRequest($"No hay suficiente stock para el producto {producto.Nombre}. Stock actual: {producto.Stock}, solicitado: {detDto.Cantidad}.");
        }
    }

    // 6. Actualizar datos básicos de la venta
    ventaExistente.Fecha = dto.Fecha;
    ventaExistente.ClienteId = dto.ClienteId;
    ventaExistente.Detalles = new List<DetalleVenta>();

    // 7. Crear los nuevos detalles y descontar stock
    foreach (var detDto in dto.Detalles)
    {
        var producto = await _context.Productos.FindAsync(detDto.ProductoId);
        // ya validado arriba que existe y tiene stock
        var precioUnitario = producto!.Precio;

        // descontar el nuevo stock
        producto.Stock -= detDto.Cantidad;

        var detalleNuevo = new DetalleVenta
        {
            ProductoId = detDto.ProductoId,
            Cantidad = detDto.Cantidad,
            PrecioUnitario = precioUnitario,
            Subtotal = precioUnitario * detDto.Cantidad
        };

        ventaExistente.Detalles.Add(detalleNuevo);
    }

    // 8. Recalcular el total
    ventaExistente.Total = ventaExistente.Detalles.Sum(d => d.Subtotal);

    // 9. Guardar cambios
    await _context.SaveChangesAsync();

    return NoContent();
}


    }
}