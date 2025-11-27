
import apiClient from "./apiClient";

export interface VentaDetalleDto {
  productoId: number;
  cantidad: number;
}

export interface CrearVentaDto {
  fecha: string;
  clienteId: number;
  detalles: VentaDetalleDto[];
}

// Lo que devuelve tu API al listar/consultar ventas
export interface Venta {
  id: number;
  fecha: string;
  total: number;
  clienteId: number;
  clienteNombre?: string;
  detalles?: {
    id: number;
    productoId: number;
    productoNombre?: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
  }[];
}
//Llamadas de los metodos del API para hacer uso de ellos en el front
export function getVentas() {
  return apiClient.get<Venta[]>("/api/Ventas");
}

export function crearVenta(data: CrearVentaDto) {
  return apiClient.post<Venta>("/api/Ventas", data);
}


export function actualizarVenta(id: number, data: CrearVentaDto) {
  return apiClient.put<Venta>(`/api/Ventas/${id}`, data);
}

export function eliminarVenta(id: number) {
  return apiClient.delete<void>(`/api/Ventas/${id}`);
}
