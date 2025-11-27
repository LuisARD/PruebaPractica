import apiClient from "./apiClient";

export interface Producto {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
}
//Llamada de los metodos del API para hacer uso en el Front
export function getProductos() {
  return apiClient.get<Producto[]>("/api/Productos");
}

export function crearProducto(data: Producto) {
  return apiClient.post<Producto>("/api/Productos", data);
}


export function actualizarProducto(id: number, data: Producto) {
  return apiClient.put<Producto>(`/api/Productos/${id}`, data);
}

export function eliminarProducto(id: number) {
  return apiClient.delete<void>(`/api/Productos/${id}`);
}
