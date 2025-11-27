import { onMounted, reactive, ref, computed } from "vue";
import {
  getProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  type Producto,
} from "../../services/productosService";
import { isLoggedIn } from "../../services/authService";

export function useProductos() {
  const productos = ref<Producto[]>([]);
  const loading = ref(false);
  const errorMessage = ref("");
  const successMessage = ref("");

  const form = reactive<Producto>({
    id: undefined,
    nombre: "",
    descripcion: "",
    precio: 0,
    stock: 0,
  });

  const editMode = ref(false);

  const usuarioLogueado = computed(() => isLoggedIn()); //Aqui se revisa si el usuario esta autentificado en el sistema

  async function cargarProductos() {
    loading.value = true;
    errorMessage.value = "";
    try {
      const resp = await getProductos();
      productos.value = resp.data;
    } catch (error: any) {
      console.error("Error al cargar productos:", error);
      errorMessage.value =
        error?.response?.data?.message ||
        "No se pudo cargar la lista de productos.";
    } finally {
      loading.value = false;
    }
  }

  function resetForm() { // resetea el formulario
    form.id = undefined;
    form.nombre = "";
    form.descripcion = "";
    form.precio = 0;
    form.stock = 0;
    editMode.value = false;
    successMessage.value = "";
    errorMessage.value = "";
  }

  function seleccionarProducto(p: Producto) {
    if (!usuarioLogueado.value) return;

    form.id = p.id;
    form.nombre = p.nombre;
    form.descripcion = p.descripcion;
    form.precio = p.precio;
    form.stock = p.stock;
    editMode.value = true;
    successMessage.value = "";
    errorMessage.value = "";
  }

async function guardarProducto() {
  if (!usuarioLogueado.value) {
    errorMessage.value = "Debes iniciar sesión para gestionar productos.";
    return;
  }

  errorMessage.value = "";
  successMessage.value = "";
  loading.value = true;

  try {
    if (editMode.value && form.id != null) {
      //  ACTUALIZA datos de producto.
      const resp = await actualizarProducto(form.id, {
        id: form.id,
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: form.precio,
        stock: form.stock,
      });

      successMessage.value = "Producto actualizado correctamente.";

      const index = productos.value.findIndex((p) => p.id === form.id);
      if (index !== -1) {
        //  Esto hace que la tabla se refresque reactivo
        productos.value[index] = resp.data;
      }
    } else {
      //  Metodo CREAR
      const resp = await crearProducto({
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: form.precio,
        stock: form.stock,
      });

      successMessage.value = "Producto creado correctamente.";
      productos.value.push(resp.data); // 👈 Se agrega al listado visible
    }

    resetForm(); // Limpia form y sale del modo edición
  } catch (error: any) {
    console.error("Error al guardar producto:", error);
    if (error.code === "ERR_NETWORK") {
      errorMessage.value = "No se pudo establecer la conexión con el servidor.";
    } else {
      errorMessage.value =
        error?.response?.data?.message || "Error al guardar el producto.";
    }
  } finally {
    loading.value = false;
  }
}


  async function borrarProducto(id?: number) {
    if (!usuarioLogueado.value) {
      errorMessage.value = "Debes iniciar sesión para eliminar productos.";
      return;
    }
    if (id == null) return;

    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar este producto?"
    );
    if (!confirmar) return;

    loading.value = true;
    errorMessage.value = "";
    successMessage.value = "";

    try {
      await eliminarProducto(id);
      productos.value = productos.value.filter((p) => p.id !== id);
      successMessage.value = "Producto eliminado correctamente.";
    } catch (error: any) {
      console.error("Error al eliminar producto:", error);
      if (error.code === "ERR_NETWORK") {
        errorMessage.value = "No se pudo establecer la conexión con el servidor.";
      } else {
        errorMessage.value =
          error?.response?.data?.message || "Error al eliminar el producto.";
      }
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    cargarProductos();
  });

  return {
    productos,
    loading,
    errorMessage,
    successMessage,
    form,
    editMode,
    usuarioLogueado,
    cargarProductos,
    resetForm,
    seleccionarProducto,
    guardarProducto,
    borrarProducto,
  };
}