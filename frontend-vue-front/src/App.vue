<!--Este parte sirve mas que nada para el navbar   -->
<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { isLoggedIn, logout } from "./services/authService";

const router = useRouter();

const loggedIn = computed(() => isLoggedIn());

function handleLogout() {
  logout();
  router.push("/login");
    window.location.reload();
}
</script>

<template>
  <div class="min-h-screen bg-base-200">
    <!-- NAVBAR -->
    <nav class="navbar bg-base-100 shadow-sm px-4 md:px-8">
      <!-- IZQUIERDA -->
      <div class="navbar-start gap-2">
        <!-- Menú hamburguesa SOLO en mobile -->
        <div class="dropdown md:hidden">
          <div tabindex="0" role="button" class="btn btn-ghost btn-square">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>

          <!-- Dropdown mobile -->
          <ul
            tabindex="-1"
            class="menu menu-sm dropdown-content mt-3 z-10 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <router-link to="/productos">Productos</router-link>
            </li>
            <li v-if="loggedIn">
              <router-link to="/clientes">Clientes</router-link>
            </li>
            <li v-if="loggedIn">
              <router-link to="/ventas">Ventas</router-link>
            </li>
          </ul>
        </div>

        <!-- Título SIEMPRE visible, pero se adapta de tamaño -->
        <router-link
          to="/productos"
          class="btn btn-ghost normal-case text-lg md:text-xl font-semibold"
        >
          Gestión de Productos
        </router-link>
      </div>

      <!-- CENTRO: menú horizontal SOLO en pantallas medianas+ -->
      <div class="navbar-center hidden md:flex">
        <ul class="menu menu-horizontal px-1">
          <li>
            <router-link to="/productos">Productos</router-link>
          </li>
          <li v-if="loggedIn">
            <router-link to="/clientes">Clientes</router-link>
          </li>
          <li v-if="loggedIn">
            <router-link to="/ventas">Ventas</router-link>
          </li>
        </ul>
      </div>

      <!-- DERECHA: login / logout -->
      <div class="navbar-end">
        <button
          class="btn btn-sm md:btn-md"
          :class="loggedIn ? 'btn-error text-white' : 'btn-outline'"
          @click="loggedIn ? handleLogout() : router.push('/login')"
        >
          {{ loggedIn ? "Cerrar sesión" : "Iniciar sesión" }}
        </button>
      </div>
    </nav>

    <!-- CONTENIDO -->
    <main class="p-4 md:p-6">
      <router-view />
    </main>
  </div>
</template>

