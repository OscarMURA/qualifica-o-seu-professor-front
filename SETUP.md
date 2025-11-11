# Configuración del Frontend

## Variables de Entorno

Este proyecto utiliza variables de entorno para configurar la conexión con el backend.

### Configuración Local

1. Copia el archivo `.env.example` a `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edita `.env.local` y ajusta la URL del backend si es necesario:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

### Variables Disponibles

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `PORT` | Puerto del servidor frontend | `3001` |
| `NEXT_PUBLIC_API_URL` | URL completa del backend API | `http://localhost:3000/api` |

**Nota:** Las variables que comienzan con `NEXT_PUBLIC_` están disponibles en el navegador.

## Puertos

- **Frontend (Next.js):** Puerto **3001** (configurable con `PORT` en `.env.local`)
- **Backend (NestJS):** Puerto **3000** (configurable en el backend)

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

3. Abre [http://localhost:3001](http://localhost:3001) en tu navegador.

## Producción

Para producción, puedes crear un archivo `.env.production.local` con la URL de tu API en producción:

```env
NEXT_PUBLIC_API_URL=https://tu-api.com/api
```

## Estructura de Configuración

La configuración del API se encuentra en:
- `src/config/api.ts` - Configuración centralizada de endpoints

Este archivo lee la variable `NEXT_PUBLIC_API_URL` del entorno y provee una estructura de configuración para todos los endpoints de la API.

