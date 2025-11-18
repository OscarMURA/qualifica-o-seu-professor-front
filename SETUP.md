# Configuración del Frontend

## Variables de Entorno

Este proyecto utiliza variables de entorno para configurar la conexión con el backend.

### Configuración Local

1. Copia el archivo `.env.example` a `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edita `.env.local` si necesitas cambiar puertos o la URL del backend:
   ```env
   PORT=3000
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

### Variables Disponibles

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `PORT` | Puerto del servidor frontend | `3000` |
| `NEXT_PUBLIC_API_URL` | URL completa del backend API | `http://localhost:3001/api` |

**Nota:** Las variables que comienzan con `NEXT_PUBLIC_` están disponibles en el navegador.

## Puertos

- **Frontend (Next.js):** Puerto **3000** (configurable con `PORT` en `.env.local`)
- **Backend API:** Puerto **3001** (configurable en el backend)

Si necesitas cambiar los puertos, edita las variables en tu archivo `.env.local`.

## Ejecutar el Proyecto

1. Instala las dependencias:
   ```bash
   npm install
   # o
   bun install
   ```

2. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   # o
   bun dev
   ```

3. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Módulo de Profesores

- Públicas:
  - `/professors`: listado con búsqueda y filtro por universidad; muestra nombre, universidad y rating promedio.
  - `/professors/[id]`: detalle con información completa, rating promedio, lista de comentarios y formulario para comentar si estás autenticado.
- Admin (solo rol `admin`):
  - `/admin/professors/new`: formulario de creación (nombre, departamento y universidad).
  - `/admin/professors/[id]/edit`: formulario de edición y botón para eliminar.

## Estructura de Configuración

La configuración del API se encuentra en:
- `src/config/api.ts` - Configuración centralizada de endpoints

Este archivo lee la variable `NEXT_PUBLIC_API_URL` del entorno y provee una estructura de configuración para todos los endpoints de la API.
