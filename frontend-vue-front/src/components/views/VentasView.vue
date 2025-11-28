<script setup lang="ts">
import { ref, computed } from "vue";
import { useVentas } from "../features/useVentas";
import { isLoggedIn } from "../../services/authService";

const {
  ventas,
  clientes,
  productos,
  ventaForm,
  loading,
  errorMessage,
  successMessage,
  totalCalculado,
  agregarLinea,
  eliminarLinea,
  guardarVenta,
  borrarVenta,
  getClienteNombre,
  getProductoNombre
} = useVentas();

// Modal control
const showModal = ref(false);

function abrirModalCrear() {
  ventaForm.fecha = new Date().toISOString().slice(0, 16);
  ventaForm.clienteId = null;
  ventaForm.detalles = [
    {
      productoId: null,
      cantidad: 1,
    },
  ];
  showModal.value = true;
}

function cerrarModal() {
  showModal.value = false;
}

async function onSubmit() {
  await guardarVenta();
  if (!errorMessage.value) {
    showModal.value = false;
  }
}

const loggedIn = computed(() => isLoggedIn());
</script>

<template>
  <div class="ventas-page space-y-4">

    <!-- HEADER -->
    <header class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-semibold">Ventas</h1>
      </div>

      <!-- Botón agregar -->
      <button 
        v-if="loggedIn"
        class="btn btn-primary btn-sm"
        @click="abrirModalCrear"
      >
        ➕ Agregar venta
      </button>
    </header>


    <!-- LOADER -->
    <div v-if="loading" class="flex justify-center py-6">
      <span class="loading loading-spinner loading-xl"></span>
    </div>


    <!-- TABLA -->
    <template v-else>

      <div v-if="ventas.length" class="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>ID</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Detalles</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            <tr class="hover:bg-base-300" v-for="(v, index) in ventas" :key="v.id">
              <td>{{ index + 1 }}</td>
              <td>{{ v.id }}</td>
              <td>{{ new Date(v.fecha).toLocaleString() }}</td>
              <td>{{ getClienteNombre(v.clienteId) }}</td>

              <td>
                <ul class="list-disc list-inside text-xs space-y-1">
                  <li 
                    v-for="det in v.detalles"
                    :key="det.productoId"
                  >
                    {{ getProductoNombre(det.productoId) }} — Cant: {{ det.cantidad }}
                  </li>
                </ul>
              </td>

              <!-- Total -->
              <td>${{ v.total?.toFixed ? v.total.toFixed(2) : v.total }}</td>

              <!-- Acciones -->
              <td>
                <button
                  class="btn btn-error btn-xs text-white"
                  @click="borrarVenta(v.id)"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>

        </table>
      </div>

      <p v-else>No hay ventas registradas.</p>

    </template>


    <!-- ALERTS -->
    <div v-if="errorMessage">
      <div role="alert" class="alert alert-error alert-outline">
        <span>{{ errorMessage }}</span>
      </div>
    </div>

    <div v-if="successMessage">
      <div role="alert" class="alert alert-success alert-outline">
        <span>{{ successMessage }}</span>
      </div>
    </div>


    <!-- MODAL REGISTRAR VENTA -->
    <dialog v-if="showModal" open class="modal modal-bottom sm:modal-middle">
      <div class="modal-box">

        <h3 class="font-bold text-lg">Registrar nueva venta</h3>

        <!-- Si no está logueado -->
        <p v-if="!loggedIn" class="text-sm text-base-content/70 mt-2">
          Debes iniciar sesión para registrar ventas.
        </p>

        <form v-if="loggedIn" @submit.prevent="onSubmit" class="space-y-3 mt-3">

          <!-- Fecha -->
          <div class="form-control">
            <label class="label"> <span class="label-text">Fecha</span> </label>
            <input v-model="ventaForm.fecha" type="datetime-local" class="input input-bordered" required />
          </div>

          <!-- Cliente -->
          <div class="form-control">
            <label class="label"> <span class="label-text">Cliente</span> </label>
            <select v-model.number="ventaForm.clienteId" class="select select-bordered" required>
              <option :value="null" disabled>Selecciona un cliente</option>
              <option v-for="c in clientes" :key="c.id" :value="c.id">
                {{ c.nombre }}
              </option>
            </select>
          </div>

          <!-- Detalle -->
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <span class="font-semibold text-sm">Detalle</span>
              <button type="button" class="btn btn-outline btn-xs" @click="agregarLinea">➕ Agregar línea</button>
            </div>

            <div 
              v-for="(linea, index) in ventaForm.detalles"
              :key="index"
              class="grid grid-cols-12 gap-2 items-end"
            >

              <!-- Producto -->
              <div class="form-control col-span-7">
                <label class="label"> <span class="label-text text-xs">Producto</span> </label>
                <select 
                  v-model.number="linea.productoId"
                  class="select select-bordered select-sm"
                  required
                >
                  <option :value="null" disabled>Selecciona un producto</option>
                  <option v-for="p in productos" :key="p.id" :value="p.id">
                    {{ p.nombre }} (${{ p.precio }})
                  </option>
                </select>
              </div>

              <!-- Cantidad -->
              <div class="form-control col-span-3">
                <label class="label"> <span class="label-text text-xs">Cantidad</span> </label>
                <input 
                  v-model.number="linea.cantidad"
                  type="number"
                  min="1"
                  class="input input-bordered input-sm"
                  required
                />
              </div>

              <!-- Eliminar -->
              <div class="col-span-2 flex justify-end">
                <button
                  type="button"
                  class="btn btn-xs btn-ghost text-error"
                  @click="eliminarLinea(index)"
                  v-if="ventaForm.detalles.length > 1"
                >
                  ✖
                </button>
              </div>

            </div>
          </div>

          <!-- Total -->
          <div class="flex justify-between items-center">
            <span class="text-sm">Total estimado:</span>
            <strong>${{ totalCalculado.toFixed(2) }}</strong>
          </div>

          <div class="modal-action">
            <button type="button" class="btn btn-ghost" @click="cerrarModal">Cancelar</button>
            <button type="submit" class="btn btn-primary">
              {{ loading ? "Guardando..." : "Registrar" }}
            </button>
          </div>

        </form>

      </div>

      <form method="dialog" class="modal-backdrop">
        <button @click="cerrarModal">Cerrar</button>
      </form>
    </dialog>

  </div>
</template>