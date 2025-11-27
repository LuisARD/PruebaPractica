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
    <div class="navbar bg-base-100 shadow-sm">
      <!-- IZQUIERDA: menú hamburguesa con dropdown -->
      <div class="navbar-start w-32">
        <div class="dropdown">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
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

          <!-- Dropdown con rutas -->
          <ul
            tabindex="-1"
            class="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
          >
            <!-- Productos (siempre visible) -->
            <li>
              <router-link to="/productos">Productos</router-link>
            </li>

            <!-- Clientes y Ventas solo si está logueado -->
            <li v-if="loggedIn">
              <router-link to="/clientes">Clientes</router-link>
            </li>
            <li v-if="loggedIn">
              <router-link to="/ventas">Ventas</router-link>
            </li>
          </ul>
        </div>
      </div>

      <!-- CENTRO: título -->
      <div class="navbar-center mr-50 ml-80">
        <router-link to="/productos" class="btn btn-ghost text-xl mr-9">
          Gestión de Productos
        </router-link>
      </div>

      <!-- DERECHA: login / logout -->
<div class="navbar-end w-50 ml-30">
  <!-- Un solo botón que cambia según loggedIn -->
  <button
    class="btn btn-sm"
    :class="loggedIn ? 'btn-error text-white' : 'btn-outline'"
    @click="loggedIn ? handleLogout() : router.push('/login')"
  >
    {{ loggedIn ? "Cerrar sesión" : "Iniciar sesión" }}
  </button>
</div>

    </div>

    <!-- CONTENIDO -->
    <main class="p-4">
      <router-view />
    </main>
  </div>
</template>
