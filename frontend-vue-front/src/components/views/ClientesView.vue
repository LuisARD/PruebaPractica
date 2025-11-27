
<!-- src/views/ClientesView.vue -->
<script setup lang="ts">
import { ref, computed } from "vue";
import { useClientes } from "../features/UseClientes";

const {
  clientes,
  loading,
  errorMessage,
  successMessage,
  form,
  editMode,
  cargarClientes,
  resetForm,
  seleccionarCliente,
  guardarCliente,
  borrarCliente,
} = useClientes();

// ref para el <dialog> del modal
const modalRef = ref<HTMLDialogElement | null>(null);

// Abrir modal para CREAR cliente
function abrirModalCrear() {
  resetForm();
  if (modalRef.value) {
    modalRef.value.showModal();
  }
}

// Abrir modal para EDITAR cliente
function abrirModalEditar(c: any) {
  seleccionarCliente(c);
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

// Guardar y cerrar modal si no hay error
async function onSubmit() {
  await guardarCliente();
  if (!errorMessage.value) {
    cerrarModal();
  }
}

// Título dinámico del modal
const tituloModal = computed(() =>
  editMode.value ? "Editar cliente" : "Crear nuevo cliente"
);
</script>

<template>
  <div class="clientes-page">
    <header class="header mb-4">
      <h1 class="text-2xl font-semibold">Clientes</h1>

    </header>

    <!-- Sección de listado -->
    <section class="card bg-base-100 rounded-box p-4 shadow-sm border border-base-content/5">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold">Lista de clientes</h2>

        <div class="flex items-center gap-2">
          <button
            class="btn btn-sm btn-outline"
            @click="cargarClientes"
            :disabled="loading"
          >
            🔄 Recargar
          </button>

          <!-- Botón AGREGAR -->
          <button
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

      <!-- Tabla de clientes -->
      <template v-else-if="clientes.length">
        <div class="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
          <table class="table">
<thead>
  <tr>
    <th>#</th>
    <th>ID</th>            <!-- <--- nueva columna -->
    <th>Nombre</th>
    <th>Email</th>
    <th>Teléfono</th>
    <th>Acciones</th>
  </tr>
</thead>
<tbody>
  <tr v-for="(c, index) in clientes" :key="c.id">
    <th>{{ index + 1 }}</th>
    <td>{{ c.id }}</td>   <!-- <--- mostramos el id -->
    <td>{{ c.nombre }}</td>
    <td>{{ c.email }}</td>
    <td>{{ c.telefono }}</td>
    <td class="flex gap-2">
      <button class="btn btn-xs btn-outline" @click="abrirModalEditar(c)">
        Editar
      </button>
      <button class="btn btn-xs btn-error text-white" @click="borrarCliente(c.id)">
        Eliminar
      </button>
    </td>
  </tr>
</tbody>

          </table>
        </div>
      </template>

      <!-- Sin clientes -->
      <p v-else class="text-sm opacity-70 py-4">
        No hay clientes registrados.
      </p>
    </section>

    <!-- ALERTS globales -->
    <div class="mt-4 space-y-2">
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
    </div>

    <!-- MODAL crear/editar cliente (DaisyUI) -->
    <dialog ref="modalRef" id="cliente_modal" class="modal modal-bottom sm:modal-middle">
      <div class="modal-box">
        <h3 class="text-lg font-bold mb-4">
          {{ tituloModal }}
        </h3>

        <form @submit.prevent="onSubmit" class="space-y-3">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Nombre</span>
            </label>
            <input
              v-model="form.nombre"
              type="text"
              class="input input-bordered w-full"
              required
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Email</span>
            </label>
            <input
              v-model="form.email"
              type="email"
              class="input input-bordered w-full"
              required
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Teléfono</span>
            </label>
            <input
              v-model="form.telefono"
              type="text"
              class="input input-bordered w-full"
              required
            />
          </div>

          <div class="modal-action">
            <button
              type="submit"
              class="btn btn-primary text-white"
              :disabled="loading"
            >
              {{ loading ? "Guardando..." : editMode ? "Actualizar" : "Crear" }}
            </button>
            <button
              type="button"
              class="btn"
              @click="cerrarModal"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>

      <!-- fondo clickeable para cerrar -->
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>
