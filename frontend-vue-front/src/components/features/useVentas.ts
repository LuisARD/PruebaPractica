import { computed, onMounted, reactive, ref } from "vue";
import { getClientes, type Cliente } from "../../services/clientesService";
import { getProductos, type Producto } from "../../services/productosService";
import {
  getVentas,
  crearVenta,
  eliminarVenta,
  type Venta,
  type CrearVentaDto,
} from "../../services/ventasService";

interface LineaDetalle {
  productoId: number | null;
  cantidad: number;
}

export function useVentas() {
  const ventas = ref<Venta[]>([]);
  const clientes = ref<Cliente[]>([]);
  const productos = ref<Producto[]>([]);

  const loading = ref(false);
  const errorMessage = ref("");
  const successMessage = ref("");

  // Formulario para crear venta
  const ventaForm = reactive<{
    fecha: string;
    clienteId: number | null;
    detalles: LineaDetalle[];
  }>({
    fecha: new Date().toISOString().slice(0, 16), // yyyy-MM-ddTHH:mm tipos de datos que se muestra en el apartado de fecha
    clienteId: null,
    detalles: [
      {
        productoId: null,
        cantidad: 1,
      },
    ],
  });

  // Cargar listas
  async function cargarClientes() {
    try {
      const resp = await getClientes();
      clientes.value = resp.data;
    } catch (error) {
      console.error("Error al cargar clientes:", error);
    }
  }

  async function cargarProductos() {
    try {
      const resp = await getProductos();
      productos.value = resp.data;
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  }

  async function cargarVentas() {
    loading.value = true;
    errorMessage.value = "";
    try {
      const resp = await getVentas();
      ventas.value = resp.data;
    } catch (error: any) {
      console.error("Error al cargar ventas:", error);
      errorMessage.value =
        error?.response?.data?.message || "No se pudo cargar la lista de ventas.";
    } finally {
      loading.value = false;
    }
  }

  function agregarLinea() { //Este metodo permite agregar variedades de producto a una venta
    ventaForm.detalles.push({
      productoId: null,
      cantidad: 1,
    });
  }

  function eliminarLinea(index: number) {
    if (ventaForm.detalles.length === 1) return; // al menos una línea
    ventaForm.detalles.splice(index, 1);
  }

  // obtener producto por id
  function getProductoById(id: number | null): Producto | undefined {
    if (id == null) return undefined;
    return productos.value.find((p) => p.id === id);
  }


function getClienteNombre(clienteId: number | null | undefined): string {
  if (clienteId == null) return "";
  const cli = clientes.value.find((c) => c.id === clienteId);
  return cli ? cli.nombre : `Cliente #${clienteId}`;
}

function getProductoNombre(productoId: number | null | undefined): string {
  if (productoId == null) return "";
  const prod = productos.value.find((p) => p.id === productoId);
  return prod ? prod.nombre : `Producto #${productoId}`;
}


  const totalCalculado = computed(() => { //Total calculado de la ventas.
    return ventaForm.detalles.reduce((acc, linea) => {
      const producto = getProductoById(linea.productoId);
      if (!producto) return acc;
      return acc + producto.precio * linea.cantidad;
    }, 0);
  });

  async function guardarVenta() {
    errorMessage.value = "";
    successMessage.value = "";

    if (!ventaForm.clienteId) {
      errorMessage.value = "Debes seleccionar un cliente.";
      return;
    }

    const detallesValidos = ventaForm.detalles.filter(
      (d) => d.productoId != null && d.cantidad > 0
    );

    if (detallesValidos.length === 0) {
      errorMessage.value = "Debes agregar al menos un producto con cantidad > 0.";
      return;
    }

    loading.value = true;

    // Construir DTO para el backend
    const dto: CrearVentaDto = {
      fecha: new Date(ventaForm.fecha).toISOString(),
      clienteId: ventaForm.clienteId,
      detalles: detallesValidos.map((d) => ({
        productoId: d.productoId as number,
        cantidad: d.cantidad,
      })),
    };

    try {
      const resp = await crearVenta(dto);
      successMessage.value = "Venta registrada correctamente.";
      ventas.value.push(resp.data);

      // Reset form
      ventaForm.fecha = new Date().toISOString().slice(0, 16);
      ventaForm.clienteId = null;
      ventaForm.detalles = [
        {
          productoId: null,
          cantidad: 1,
        },
      ];
    } catch (error: any) {
      console.error("Error al registrar venta:", error);
      if (error.code === "ERR_NETWORK") {
        errorMessage.value = "No se pudo establecer la conexión con el servidor.";
      } else {
        errorMessage.value =
          error?.response?.data?.message || "Error al registrar la venta.";
      }
    } finally {
      loading.value = false;
    }
  }

  async function borrarVenta(id: number) {
    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar esta venta?"
    );
    if (!confirmar) return;

    loading.value = true;
    errorMessage.value = "";
    successMessage.value = "";

    try {
      await eliminarVenta(id);
      ventas.value = ventas.value.filter((v) => v.id !== id);
      successMessage.value = "Venta eliminada correctamente.";
    } catch (error: any) {
      console.error("Error al eliminar venta:", error);
      if (error.code === "ERR_NETWORK") {
        errorMessage.value = "No se pudo establecer la conexión con el servidor.";
      } else {
        errorMessage.value =
          error?.response?.data?.message || "Error al eliminar la venta.";
      }
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    cargarClientes();
    cargarProductos();
    cargarVentas();
  });

  return {
    ventas,
    clientes,
    productos,
    ventaForm,
    loading,
    errorMessage,
    successMessage,
    totalCalculado,
    cargarVentas,
    agregarLinea,
    eliminarLinea,
    guardarVenta,
    borrarVenta,
    getProductoById,
    getClienteNombre,
    getProductoNombre,
  };
}
