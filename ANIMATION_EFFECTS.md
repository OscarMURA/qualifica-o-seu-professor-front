# Efectos de Animación en la Imagen del Home

## 🎬 Efectos Implementados

### 1. **Efecto Ken Burns** (Zoom + Paneo)
- **Duración**: 30 segundos
- **Comportamiento**: La imagen hace un zoom suave del 100% al 110% y se mueve ligeramente
- **Clase**: `animate-ken-burns`

### 2. **Overlay con Pulso Suave**
- **Duración**: 4 segundos
- **Comportamiento**: El overlay con gradiente cambia su opacidad suavemente
- **Clase**: `animate-pulse-slow`

### 3. **Elementos Flotantes** (3 círculos borrosos)
- **Círculo 1**: Flotación normal (8s)
- **Círculo 2**: Flotación con delay de 2s (10s)
- **Círculo 3**: Flotación lenta con delay de 4s (12s)
- **Efecto**: Crean profundidad y movimiento visual sin ser intrusivos

## 🎨 Personalización

### Cambiar velocidad de las animaciones

Edita `src/app/globals.css`:

```css
/* Más rápido */
.animate-ken-burns {
  animation: kenBurns 15s ease-in-out infinite;
}

/* Más lento */
.animate-ken-burns {
  animation: kenBurns 45s ease-in-out infinite;
}
```

### Ajustar intensidad del zoom

En la animación `kenBurns`:

```css
@keyframes kenBurns {
  50% {
    transform: scale(1.15) translate(-3%, -3%); /* Más zoom */
  }
}
```

### Cambiar colores de elementos flotantes

En `src/app/page.tsx`:

```tsx
<div className="absolute ... bg-blue-400/20 ..."></div>
// Cambiar a:
<div className="absolute ... bg-pink-400/30 ..."></div>
```

## 📱 Performance

- ✅ Las animaciones usan `transform` y `opacity` (aceleración GPU)
- ✅ `will-change` implícito en las animaciones
- ✅ Solo se cargan en pantallas `lg` y superiores
- ✅ Imagen con `priority` para carga rápida

## 🚀 Alternativas Avanzadas

Si quieres efectos más elaborados, puedes usar:

### Framer Motion
```bash
npm install framer-motion
```

### React Spring
```bash
npm install @react-spring/web
```

### GSAP
```bash
npm install gsap
```

## 🎯 Resultado

La imagen ahora tiene:
- ✨ Movimiento sutil y profesional
- 🌊 Sensación de profundidad
- 💫 Elementos decorativos animados
- 🎨 Sin ser distractivo ni molesto

El efecto es elegante y mejora la experiencia visual sin comprometer el rendimiento.
