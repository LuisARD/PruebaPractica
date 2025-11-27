
import apiClient from "./apiClient";

export interface Cliente {
  id?: number;
  nombre: string;
  email: string;
  telefono: string;
}
//Llamada de los metodos del API para hacer uso de ellos en el front
export function getClientes() {
  return apiClient.get<Cliente[]>("/api/Clientes");
}

export function crearCliente(data: Cliente) {
  return apiClient.post<Cliente>("/api/Clientes", data);
}

export function actualizarCliente(id: number, data: Cliente) {
  return apiClient.put<Cliente>(`/api/Clientes/${id}`, data);
}

export function eliminarCliente(id: number) {
  return apiClient.delete<void>(`/api/Clientes/${id}`);
}
