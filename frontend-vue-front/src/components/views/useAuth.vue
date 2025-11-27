<script setup lang="ts">
import { useAuth } from "../features/useAuth";

const {
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
} = useAuth();
</script>

<template>
 <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-base-200">
    <div class="w-full max-w-md">
      <h1 class="text-2xl font-bold text-center mb-6">
        Iniciar sesión en el sistema
      </h1>

      <!-- Si NO está logueado, mostrar login/registro -->
      <section v-if="!loggedIn" class="space-y-4">
        <!-- Tabs Login / Registro -->
        <div role="tablist" class="tabs tabs-boxed w-full">
          <button
            role="tab"
            class="tab flex-1"
            :class="{ 'tab-active': activeTab === 'login' }"
            @click="activeTab = 'login'"
          >
            Login
          </button>
          <button
            role="tab"
            class="tab flex-1"
            :class="{ 'tab-active': activeTab === 'register' }"
            @click="activeTab = 'register'"
          >
            Registro
          </button>
        </div>

        <!-- CARD LOGIN -->
        <fieldset
          v-if="activeTab === 'login'"
          class="fieldset bg-base-100 border-base-300 rounded-box border p-6 shadow"
        >
          <legend class="fieldset-legend text-lg font-semibold">
            Login
          </legend>

          <form @submit.prevent="handleLogin" class="space-y-3">
            <label class="label">
              <span class="label-text">Usuario</span>
            </label>
            <input
              v-model="loginForm.username"
              type="text"
              class="input input-bordered w-full"
              placeholder="Nombre de usuario"
              required
            />

            <label class="label">
              <span class="label-text">Contraseña</span>
            </label>
            <input
              v-model="loginForm.password"
              type="password"
              class="input input-bordered w-full"
              placeholder="Contraseña"
              required
            />

<button type="submit" :disabled="loading" class="btn btn-primary btn-sm">
  <span v-if="loading" class="loading loading-spinner loading-xs mr-2"></span>
  <span>{{ loading ? "Cargando..." : "Entrar" }}</span>
</button>

          </form>
        </fieldset>

        <!-- CARD REGISTRO -->
        <fieldset
          v-else
          class="fieldset bg-base-100 border-base-300 rounded-box border p-6 shadow"
        >
          <legend class="fieldset-legend text-lg font-semibold">
            Registro
          </legend>

          <form @submit.prevent="handleRegister" class="space-y-3">
            <label class="label">
              <span class="label-text">Usuario</span>
            </label>
            <input
              v-model="registerForm.username"
              type="text"
              class="input input-bordered w-full"
              placeholder="Nombre de usuario"
              required
            />

            <label class="label">
              <span class="label-text">Contraseña</span>
            </label>
            <input
              v-model="registerForm.password"
              type="password"
              class="input input-bordered w-full"
              placeholder="Contraseña"
              required
            />

<button type="submit" :disabled="loading" class="btn btn-primary btn-sm">
  <span v-if="loading" class="loading loading-spinner loading-xs mr-2"></span>
  <span>{{ loading ? "Cargando..." : "Entrar" }}</span>
</button>

          </form>
        </fieldset>

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

      </section>

      <!-- Si YA está logueado -->
      <section v-else class="mt-4">
        <fieldset class="fieldset bg-base-100 border-base-300 rounded-box border p-6 shadow">
          <legend class="fieldset-legend text-lg font-semibold">
            Sesión iniciada
          </legend>

          <p class="mb-4">
            Ya tienes un token guardado en el navegador.
          </p>
          <button
            class="btn btn-error text-white w-full"
            @click="handleLogout"
          >
            Cerrar sesión
          </button>
        </fieldset>
      </section>
    </div>
  </div>
</template>

