// Enrutador para el nav y la navegacion entre paginas del sistema
import { createRouter, createWebHistory } from "vue-router";
import ProductosView from "../components/views/ProductosView.vue";
import ClientesView from "../components/views/ClientesView.vue";
import VentasView from "../components/views/VentasView.vue";
import UseAuthView from "../components/views/useAuth.vue"; // tu pantalla Login/Register

function isLoggedIn(): boolean {
  return !!localStorage.getItem("token");
}

const routes = [
  {
    path: "/login",
    name: "login",
    component: UseAuthView,
    meta: { guestOnly: true },
  },
  {
    path: "/",
    redirect: "/productos",
  },
  {
    path: "/productos",
    name: "productos",
    component: ProductosView,
    // pública (cualquiera puede ver productos)
  },
  {
    path: "/clientes",
    name: "clientes",
    component: ClientesView,
    meta: { requiresAuth: true },
  },
  {
    path: "/ventas",
    name: "ventas",
    component: VentasView,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const loggedIn = isLoggedIn();

  if (to.meta.requiresAuth && !loggedIn) {
    return next({ name: "login" });
  }

  if (to.meta.guestOnly && loggedIn) {
    return next({ name: "productos" });
  }

  next();
});


export default router;

