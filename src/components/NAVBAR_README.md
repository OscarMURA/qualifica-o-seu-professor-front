# Navbar Component

## Descripción

Componente de navegación responsive para la aplicación "Califica a tu Profesor". Incluye:

- **Diseño responsive**: Se adapta automáticamente a móviles, tablets y escritorio
- **Menú hamburguesa**: Para dispositivos móviles
- **Autenticación integrada**: Muestra diferentes opciones según el estado de autenticación
- **Información del usuario**: Muestra nombre, email y rol cuando está autenticado
- **Navegación fluida**: Integrado con Next.js router

## Características

### Desktop (≥768px)
- Logo clickeable a la izquierda
- Menú de navegación horizontal
- Información del usuario y botón de logout a la derecha
- Botones de login/registro para usuarios no autenticados

### Mobile (<768px)
- Logo clickeable
- Botón hamburguesa que abre/cierra el menú
- Menú desplegable con todas las opciones
- Información del usuario en la parte superior del menú
- Navegación vertical

## Uso

El navbar ya está integrado en el layout principal (`src/app/layout.tsx`), por lo que aparecerá en todas las páginas automáticamente.

### Personalización

Para añadir nuevas rutas de navegación, edita el archivo `src/components/Navbar.tsx`:

```tsx
// En la sección Desktop Menu
<button
  onClick={() => navigateTo("/nueva-ruta")}
  className="text-slate-700 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
>
  Nueva Página
</button>

// Y también en la sección Mobile menu
<button
  onClick={() => navigateTo("/nueva-ruta")}
  className="text-slate-700 hover:text-blue-500 hover:bg-slate-100 block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors"
>
  Nueva Página
</button>
```

## Dependencias

- `useAuth`: Hook personalizado para manejar autenticación
- `useRouter`: De Next.js para navegación
- `Button`: Componente UI personalizado

## Estilos

El navbar utiliza:
- Tailwind CSS para todos los estilos
- Posicionamiento sticky para mantenerlo en la parte superior al hacer scroll
- Sombra sutil para separación visual
- Transiciones suaves en hover

## Accesibilidad

- Etiquetas ARIA apropiadas
- Botones semánticos
- Navegación por teclado
- Indicadores visuales de estado
