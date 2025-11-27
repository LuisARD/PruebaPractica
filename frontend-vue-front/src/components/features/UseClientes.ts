import { onMounted, reactive, ref, computed } from "vue";
import {
  getClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
  type Cliente,
} from "../../services/clientesService";
import { isLoggedIn } from "../../services/authService";

export function useClientes() {
  const clientes = ref<Cliente[]>([]);
  const loading = ref(false);
  const errorMessage = ref("");
  const successMessage = ref("");

  const form = reactive<Cliente>({
    id: undefined,
    nombre: "",
    email: "",
    telefono: "",
  });

  const editMode = ref(false);
  const usuarioLogueado = computed(() => isLoggedIn());

  async function cargarClientes() { //Almacenados datos dentro de la tabla cliente
    loading.value = true;
    errorMessage.value = "";
    try {
      const resp = await getClientes();
      clientes.value = resp.data;
    } catch (error: any) {
      console.error("Error al cargar clientes:", error);
      errorMessage.value =
        error?.response?.data?.message || "No se pudo cargar la lista de clientes.";
    } finally {
      loading.value = false;
    }
  }

  function resetForm() { //Borrar todos los datos del form al finalizar su funcion
    form.id = undefined;
    form.nombre = "";
    form.email = "";
    form.telefono = "";
    editMode.value = false;
    successMessage.value = "";
    errorMessage.value = "";
  }

  function seleccionarCliente(c: Cliente) {
    if (!usuarioLogueado.value) return;
    form.id = c.id;
    form.nombre = c.nombre;
    form.email = c.email;
    form.telefono = c.telefono;
    editMode.value = true;
    errorMessage.value = "";
    successMessage.value = "";
  }

  async function guardarCliente() { // Almacena o crear un nuevo cliente dentro de la tabla.
    if (!usuarioLogueado.value) {
      errorMessage.value = "Debes iniciar sesión para gestionar clientes.";
      return;
    }

    errorMessage.value = "";
    successMessage.value = "";
    loading.value = true;

    try {
      if (editMode.value && form.id != null) {
        // ACTUALIZAR: envia id de clientes al api para actualizar los datos del cliente.
        const resp = await actualizarCliente(form.id, {
          id: form.id,
          nombre: form.nombre,
          email: form.email,
          telefono: form.telefono,
        });
        successMessage.value = "Cliente actualizado correctamente.";

        const index = clientes.value.findIndex((x) => x.id === form.id);
        if (index !== -1) clientes.value[index] = resp.data;
      } else {
        // CREAR
        const resp = await crearCliente({
          nombre: form.nombre,
          email: form.email,
          telefono: form.telefono,
        });
        successMessage.value = "Cliente creado correctamente.";
        clientes.value.push(resp.data);
      }

      resetForm();
    } catch (error: any) {
      console.error("Error al guardar cliente:", error);
      if (error?.code === "ERR_NETWORK") {
        errorMessage.value = "No se pudo establecer la conexión con el servidor.";
      } else {
        errorMessage.value =
          error?.response?.data?.message || "Error al guardar el cliente.";
      }
    } finally {
      loading.value = false;
    }
  }

  async function borrarCliente(id?: number) { //Metodo para eliminar cliente dependiendo de si estas en autorizado o no 
    if (!usuarioLogueado.value) {
      errorMessage.value = "Debes iniciar sesión para eliminar clientes.";
      return;
    }
    if (id == null) return;

    const confirmar = window.confirm("¿Seguro que deseas eliminar este cliente?");
    if (!confirmar) return;

    loading.value = true;
    errorMessage.value = "";
    successMessage.value = "";

    try { //Obtiene el id del cliente que deseas eliminar ya que en el api espera como parametro el ID para hacer su funcion
      await eliminarCliente(id);
      clientes.value = clientes.value.filter((c) => c.id !== id);
      successMessage.value = "Cliente eliminado correctamente.";
    } catch (error: any) {
      console.error("Error al eliminar cliente:", error);
      errorMessage.value =
        error?.response?.data?.message || "Error al eliminar el cliente.";
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => cargarClientes());

  return { 
    clientes,
    loading,
    errorMessage,
    successMessage,
    form,
    editMode,
    usuarioLogueado,
    cargarClientes,
    resetForm,
    seleccionarCliente,
    guardarCliente,
    borrarCliente,
  };
}
