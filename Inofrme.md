# Informe de funcionalidades y arquitectura

Este documento describe qué hace la aplicación "Califica tu Profesor", cómo está implementada la autenticación, la autorización por roles y la gestión del estado, además de puntos clave de arquitectura y mejoras sugeridas.

## Resumen del stack
- Framework: Next.js (App Router) y React
- Estilos: Tailwind CSS
- HTTP client: Axios (`src/lib/api.ts`)
- Estado global: Zustand con persistencia (`src/context/useAuth.ts`)
- Tipado: TypeScript
- Testing disponible: Jest y Playwright (scripts en `package.json`)

## Funcionalidades principales
A continuación, un recorrido por las pantallas y flujos que ya funcionan en la app.

1) Inicio
- Muestra CTA según sesión: si el usuario está autenticado, se saludará por nombre y se ofrecen accesos rápidos; si no, botones a Registro/Iniciar sesión.
- Archivo: `src/app/page.tsx`.

2) Profesores
- Listado con búsqueda por texto y filtro por universidad. El filtro se sincroniza con la URL usando query param `?university=` para permitir compartir/recordar el estado del filtro. Paginación de 15 ítems por página.
- Cada tarjeta muestra nombre, departamento, universidad y rating promedio si está disponible.
- Archivo: `src/app/professors/page.tsx` y componente `src/components/professors/ProfessorCard.tsx`.

3) Detalle de Profesor
- Presenta datos del profesor, universidad asociada, rating promedio y comentarios.
- Los usuarios autenticados pueden:
  - Publicar comentario con calificación de 1 a 5.
  - La UI de estrellas es interactiva y accesible (botones con `aria-label`).
- Los administradores ven botón "Editar" que lleva al formulario de edición.
- Archivo: `src/app/professors/[id]/page.tsx`.

4) CRUD de Profesores (solo Admin)
- Crear/editar/eliminar profesores. Las páginas verifican autenticación y rol admin, y redirigen si faltan permisos.
- Archivos: `src/app/admin/professors/new/page.tsx`, `src/app/admin/professors/[id]/edit/page.tsx` y formulario `src/components/professors/ProfessorForm.tsx`.

5) Universidades
- Listado y detalle de universidades con sus profesores asociados.
- Crear/editar/eliminar universidades (solo Admin). Las páginas protegen el acceso.
- Archivos: `src/app/universities/page.tsx`, `src/app/universities/[id]/page.tsx`, `src/app/universities/create/page.tsx`, `src/app/universities/[id]/edit/page.tsx`, componentes en `src/components/universities/*`.

6) Perfil y Configuración
- Perfil: muestra datos del usuario y estadísticas (total de comentarios). Fuente de datos: `/users/me` y `/comments/me`.
- Configuración: actualizar nombre, cambiar contraseña y eliminar cuenta con confirmación.
- Archivos: `src/app/profile/page.tsx`, `src/app/settings/page.tsx`, util `src/lib/profile.ts`.

7) Comentarios del usuario
- Sección para revisar y gestionar comentarios propios (carga desde `/comments/me`), con opciones de edición/eliminación.
- Archivo: `src/app/profile/comments/page.tsx` y util `src/lib/comments.ts`.

8) Panel de Administración (solo Admin)
- Dashboard con métricas (usuarios, profesores, universidades, comentarios) y accesos a secciones de gestión.
- Archivo: `src/app/admin/page.tsx` y util `src/lib/admin.ts`.

9) Autenticación y verificación de email
- Registro con validaciones de contraseña y barra de progreso.
- Verificación de email vía enlace. Sin email verificado no se permite iniciar sesión.
- Archivos: `src/app/signup/page.tsx`, `src/app/login/page.tsx`, `src/app/auth/verify/page.tsx`.

10) Navegación y experiencia de usuario
- Navbar adaptativa según sesión y rol. Ofrece atajos a Admin cuando corresponde y muestra datos del usuario.
- Soporta cambio de tema (claro/oscuro) persistente.
- Archivo: `src/components/Navbar.tsx`.

---

## Autenticación (cómo está implementada)
Objetivo: identificar al usuario, persistir sesión y acompañar las llamadas a la API con token.

- Servicio de auth: `src/lib/auth.ts`
  - `login(credentials)`: POST a `API_CONFIG.ENDPOINTS.AUTH.LOGIN`.
  - `register(data)`: POST a `.../register` (mapeando `name/fullName` según backend).
  - `getProfile()`: GET a `.../me`.
  - `verifyEmail(token)`: GET a `.../verify-email?token=...`.
  - `resendVerification(email)`: POST a `.../resend-verification`.
- Cliente HTTP: `src/lib/api.ts`
  - Base URL: `src/config/api.ts` (por defecto `http://localhost:3000/api`).
  - Interceptor de request: adjunta `Authorization: Bearer <token>` si hay token en `localStorage`.
  - Interceptor de response: ante `401` limpia token y redirige a `/login` si no estamos ya en `/login` o `/signup`.
- Estado de sesión global: `src/context/useAuth.ts` (Zustand + persist)
  - Estado: `{ user, token, isAuthenticated }`.
  - Acciones: `setAuth(user, token)`, `logout()`, `updateUser(user)`.
  - Persistencia: clave `califica-auth-storage` en `localStorage`.
  - Rehidratación: si existen `token` y `user`, fuerza `isAuthenticated = true`.
- Flujo de login (vista `src/app/login/page.tsx`):
  - Verifica explícitamente `response.emailVerified === true` y la presencia de `token` (o `accessToken`).
  - Si el email no está verificado o falta token: no se loguea, muestra aviso y permite reenviar verificación.

Conclusión: la autenticación es del tipo token Bearer almacenado en `localStorage`, con verificación de email previa al acceso.

## Autorización (reglas de acceso y guards)
- Rol de usuario: `"student" | "admin"` (definido en `src/types/user.ts`).
- Protección de páginas sensibles:
  - Admin Dashboard y secciones: verifican `isAuthenticated` y `user.role === "admin"`. Si falla, redirigen a `/login` o al listado público correspondiente. Ver ejemplos en `src/app/admin/page.tsx`, `src/app/admin/professors/[id]/edit/page.tsx`, `src/app/universities/create/page.tsx`.
  - Formulario de comentarios: sólo visible si `isAuthenticated` (en `src/app/professors/[id]/page.tsx`). Si no, se muestra CTA para iniciar sesión.
  - Navbar: oculta/enseña enlaces según sesión y rol (en `src/components/Navbar.tsx`).
- Defensa reactiva: además de los guards en UI, el interceptor 401 fuerza logout y redirección, evitando pantallas en estado inconsistente si expira el token.

## Gestión del estado (global y de vista)
- Global (sesión):
  - Implementado con Zustand en `src/context/useAuth.ts`.
  - Persistencia en `localStorage` para mantener login entre recargas.
  - API del store pequeña y clara: `setAuth`, `logout`, `updateUser`.
- De vista (por página/componente):
  - Búsqueda/filtros en Profesores: `useState` + `useSearchParams` y sincronización de la URL con `router.replace`, para mantener `?university=` sin contaminar el historial.
  - Paginación local: cálculo de `totalPages`, `currentItems` y scroll al cambiar de página.
  - Detalle de profesor: estados de carga, error, formulario (rating, contenido, envío con feedback).
  - Perfil/Settings: spinners de carga, banners de éxito/error y confirmaciones.
- Datos derivados y fallback:
  - `professorsService.list()` obtiene profesores y luego, en paralelo, el rating promedio por profesor; si el endpoint de rating falla, la UI hace fallback a `0` sin romper el flujo.

## Integración con API (endpoints relevantes)
- Base: definida en `src/config/api.ts`.
- Autenticación: `/auth/login`, `/auth/register`, `/auth/me`, `/auth/verify-email`, `/auth/resend-verification`.
- Profesores: `/professors` CRUD, comentarios y rating en `/comments/professor/:id/comments` y `/comments/professor/:id/rating`.
- Universidades: `/universities` CRUD.
- Usuarios: `/users`, `/users/me` y operaciones de actualización/eliminación.
- Comentarios del usuario: `/comments/me`, `/comments/:id`.

## Modo oscuro
- Implementación en `src/components/Navbar.tsx`.
  - Se detecta preferencia del SO (`prefers-color-scheme`) y/o se usa el valor almacenado en `localStorage` bajo la clave `theme`.
  - El tema se aplica estableciendo `data-theme` en `document.documentElement` y se mantiene entre sesiones.

Imagen de referencia del modo oscuro:

![img.png](img.png)

## Manejo de errores y UX
- Loader/spinner en pantallas con llamadas a la API (Perfil, Admin, listados).
- Banners de error/success en Login, Signup y Settings.
- Redirecciones consistentes ante 401 desde el interceptor.


## Galería de pantallas (flujo funcional)

1) Menú principal (Inicio)

![Imagen de WhatsApp 2025-11-17 a las 18.16.13_2d0b8f9c.jpg](Imagen%20de%20WhatsApp%202025-11-17%20a%20las%2018.16.13_2d0b8f9c.jpg)

2) Listado de profesores

![Imagen de WhatsApp 2025-11-17 a las 18.23.34_9915de73.jpg](Imagen%20de%20WhatsApp%202025-11-17%20a%20las%2018.23.34_9915de73.jpg)
3) Detalle de profesor (con comentarios y rating)

![Imagen de WhatsApp 2025-11-17 a las 18.23.45_1c27e461.jpg](Imagen%20de%20WhatsApp%202025-11-17%20a%20las%2018.23.45_1c27e461.jpg)
4) Detalle de profesor (sin comentarios aún)
![Imagen de WhatsApp 2025-11-17 a las 18.32.09_b8521361.jpg](Imagen%20de%20WhatsApp%202025-11-17%20a%20las%2018.32.09_b8521361.jpg)

5) Edición de profesor (solo Admin)
![Imagen de WhatsApp 2025-11-17 a las 18.32.20_cea76e88.jpg](Imagen%20de%20WhatsApp%202025-11-17%20a%20las%2018.32.20_cea76e88.jpg)

6) Detalle de universidad
![Imagen de WhatsApp 2025-11-17 a las 18.32.45_f74c512a.jpg](Imagen%20de%20WhatsApp%202025-11-17%20a%20las%2018.32.45_f74c512a.jpg)
