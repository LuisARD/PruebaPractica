// Aqui se importan los metodos y llamados que se haran uso en la vista de login y registro
import { reactive, ref, computed } from "vue";
import {
  login,
  register,
  logout,
  isLoggedIn,
  type LoginRequest,
  type RegisterRequest,
} from "../../services/authService";
import { useRouter } from "vue-router"; 

export function useAuth() {
  const router = useRouter();

  const activeTab = ref<"login" | "register">("login");
  const loading = ref(false);
  const errorMessage = ref("");
  const successMessage = ref("");

  //Datos requeridos para loguearte en el sistema
  const loginForm = reactive<LoginRequest>({
    username: "",
    password: "",
  });

  //Datos requeridos para registrarte en el sistema
  const registerForm = reactive<RegisterRequest>({
    username: "",
    password: "",
  });

  const loggedIn = computed(() => isLoggedIn());
//Funciones y mensajes de error del manejo a la conexion del login 
  async function handleLogin() {
    errorMessage.value = "";
    successMessage.value = "";
    loading.value = true;

    try {
      await login({
        username: loginForm.username,
        password: loginForm.password,
      });

      successMessage.value = "Sesión iniciada correctamente";

      //  Después de loguear, navega a /productos
      await router.push("/productos");
      window.location.reload();
    } catch (error: any) {
      console.error("Error al realizar el login:", error);

      if (error.code === "ERR_NETWORK") {
        errorMessage.value = "No se pudo establecer la conexión con el servidor.";
      } else {
        errorMessage.value =
          error?.response?.data?.message ||
          "¡Error al iniciar sesión! Este usuario no se encuentra registrado en el sistema.";
      }
    } finally {
      loading.value = false;
    }
  }
 //Funciones y mensaje de errores para el manejo y la conexion con registro
  async function handleRegister() {
    errorMessage.value = "";
    successMessage.value = "";
    loading.value = true;

    try {
      await register({
        username: registerForm.username,
        password: registerForm.password,
      });
      successMessage.value =
        "Haz sido registrado exitosamente. Ahora puedes iniciar sesión.";
      activeTab.value = "login";
    } catch (error: any) {
      console.error("Error al registrarte en el sistema:", error);

      if (error.code === "ERR_NETWORK") {
        errorMessage.value =
          "No se pudo establecer la conexión con el servidor.";
      } else {
        errorMessage.value =
          error?.response?.data?.message ||
          "¡Error al registrarse! El usuario ya ha sido registrado anteriormente, revisa los datos.";
      }
    } finally {
      loading.value = false;
    }
  }
 //Funcion que sirve para desloguearte del sistema
  function handleLogout() {
    logout();
    successMessage.value = "";
    errorMessage.value = "";

    // Al cerrar sesión, te envia al login
    router.push("/login");
    window.location.reload();
  }

  return {
    activeTab,
    loading,
    errorMessage,
    successMessage,
    loginForm,
    registerForm,
    loggedIn,
    handleLogin,
    handleRegister,
    handleLogout,
  };
}
