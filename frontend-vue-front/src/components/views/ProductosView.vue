
<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useProductos } from "../features/useProductos";

const {
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
} = useProductos();

// 🔹 Referencia al <dialog> de DaisyUI
const modalRef = ref<HTMLDialogElement | null>(null);

// Abrir modal para CREAR producto
function abrirModalCrear() {
  resetForm();
  if (modalRef.value) {
    modalRef.value.showModal();
  }
}

// Abrir modal para EDITAR producto
function abrirModalEditar(p: any) {
  seleccionarProducto(p);
  if (modalRef.value) {
    modalRef.value.showModal();
  }
}

// Cerrar modal
function cerrarModal() {
  if (modalRef.value) {
    modalRef.value.close();
  }
}

// Guardar producto y cerrar modal si todo va bien
async function onSubmit() {
  await guardarProducto();
  if (!errorMessage.value) {
    cerrarModal();
  }
}

// Título dinámico del modal
const tituloModal = computed(() =>
  editMode.value ? "Editar producto" : "Crear nuevo producto"
);

// Si quieres cargar productos al montar (por si tu composable no lo hace)
onMounted(() => {
  if (!productos.value.length) {
    cargarProductos();
  }
});
</script>

<template>
  <div class="p-4 space-y-4">
    <header class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Productos</h1>
    </header>

    <!-- Sección de listado -->
    <section class="card bg-base-100 shadow-sm">
      <div class="card-body">
        <div class="flex items-center justify-between mb-4">
          <h2 class="card-title">Lista de productos</h2>

          <div class="flex gap-2">
            <button class="btn btn-outline btn-sm" @click="cargarProductos" :disabled="loading">
              🔄 Recargar
            </button>

            <!-- Botón AGREGAR solo si está logueado -->
            <button
              v-if="usuarioLogueado"
              class="btn btn-primary btn-sm"
              type="button"
              @click="abrirModalCrear"
            >
              ➕ Agregar
            </button>
          </div>
        </div>

        <!-- Loader -->
        <div v-if="loading" class="flex justify-center py-6">
          <span class="loading loading-spinner loading-xl"></span>
        </div>

        <!-- Tabla -->
        <template v-else-if="productos.length">
          <div class="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
            <table class="table">
              <tr class="hover:bg-base-300" v-for="(p, index) in productos" :key="p.id">
  <th>{{ index + 1 }}</th>
  <td >{{ p.nombre }}</td>
  <td >{{ p.descripcion }}</td>
  <td >${{ Number(p.precio ?? 0).toFixed(2) }}</td>
  <td >{{ p.stock }}</td>

  <td v-if="usuarioLogueado" class="flex gap-2">
    <button
      class="btn btn-xs btn-outline"
      @click="abrirModalEditar(p)"
    >
      Editar
    </button>
    <button
      class="btn btn-xs btn-error text-white"
      @click="borrarProducto(p.id)"
    >
      Eliminar
    </button>
  </td>
                </tr>
            </table>
          </div>
        </template>

        <!-- Sin productos -->
        <p v-else class="text-sm text-base-content/70">
          No hay productos registrados.
        </p>
      </div>
    </section>

<!-- Mensajes globales -->
<div v-if="errorMessage" class="mt-4">
  <div role="alert" class="alert alert-error alert-outline">
    <span>{{ errorMessage }}</span>
  </div>
</div>

<div v-if="successMessage" class="mt-4">
  <div role="alert" class="alert alert-success alert-outline">
    <span>{{ successMessage }}</span>
  </div>
</div>


    <!-- MODAL DaisyUI de crear/editar producto -->
    <dialog ref="modalRef" id="modal_productos" class="modal modal-bottom sm:modal-middle">
      <div class="modal-box">
        <h3 class="text-lg font-bold mb-4">{{ tituloModal }}</h3>

        <p v-if="!usuarioLogueado" class="text-sm text-base-content/70 mb-4">
          Debes iniciar sesión para gestionar productos.
        </p>

        <form v-if="usuarioLogueado" @submit.prevent="onSubmit" class="space-y-3">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Nombre</span>
            </label>
            <input
              v-model="form.nombre"
              type="text"
              required
              class="input input-bordered w-full"
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Descripción</span>
            </label>
            <input
              v-model="form.descripcion"
              type="text"
              required
              class="input input-bordered w-full"
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Precio</span>
            </label>
            <input
              v-model.number="form.precio"
              type="number"
              min="0"
              step="0.01"
              required
              class="input input-bordered w-full"
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Stock</span>
            </label>
            <input
              v-model.number="form.stock"
              type="number"
              min="0"
              step="1"
              required
              class="input input-bordered w-full"
            />
          </div>

          <div class="modal-action">
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading" class="loading loading-spinner loading-xs mr-2"></span>
              {{ loading ? "Guardando..." : editMode ? "Actualizar" : "Crear" }}
            </button>

            <!-- Este form con method="dialog" cierra el modal automáticamente -->
            <form method="dialog">
              <button type="submit" class="btn">
                Cancelar
              </button>
            </form>
          </div>
        </form>
      </div>

      <!-- Clic fuera del modal también lo cierra -->
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>


