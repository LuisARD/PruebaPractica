import apiClient from "./apiClient";

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

//Llamada al api desde el front para hacer usos de sus metodos 
export async function register(data: RegisterRequest) {
  return apiClient.post("/api/Auth/register", data);
}

export async function login(data: LoginRequest): Promise<string> {
  console.log("Login data enviado:", data);

  const response = await apiClient.post<LoginResponse>("/api/Auth/login", data);
  const token = response.data.token;

  localStorage.setItem("token", token);
  return token;
}

//Borrar el token o la clave del localStorage
export function logout() {
  localStorage.removeItem("token");
}

export function isLoggedIn(): boolean {
  return !!localStorage.getItem("token");
}
