# PWA - Progressive Web App

## Configuración completada

La aplicación ahora funciona como una PWA (Progressive Web App), lo que significa que puede:

- 📱 Instalarse en dispositivos móviles como una app nativa
- 🚀 Funcionar sin conexión (offline)
- 💾 Guardarse en la pantalla de inicio
- 📏 Aprovechar todo el espacio de la pantalla

## Características implementadas

### 1. Manifest.json
- Configurado en `/public/manifest.json`
- Define nombre, iconos, colores de tema
- Modo `standalone` para experiencia de app nativa

### 2. Service Worker
- Implementado en `/public/sw.js`
- Cachea recursos para funcionamiento offline
- Registrado automáticamente en `src/main.tsx`

### 3. Viewport optimizado
- Todos los paneles usan `100dvh` (dynamic viewport height)
- Diseño responsive adaptado para móviles
- Elementos táctiles optimizados
- Scroll controlado para evitar contenido oculto

### 4. Meta tags PWA
- Theme color configurado
- Viewport optimizado para móviles
- Soporte para iOS Safari
- Manifest vinculado correctamente

## Generar iconos

Para generar los iconos PNG necesarios:

1. Abre `public/generate-icons.html` en tu navegador
2. Haz clic en los botones para descargar los iconos
3. Guarda `icon-192.png` e `icon-512.png` en la carpeta `/public`

**Nota**: El generador de iconos crea iconos básicos con la letra "M". Puedes reemplazarlos con tus propios diseños personalizados.

## Instalar la PWA

### En dispositivos Android:
1. Abre la app en Chrome
2. Toca el menú (⋮) → "Añadir a pantalla de inicio"
3. Sigue las instrucciones

### En dispositivos iOS:
1. Abre la app en Safari
2. Toca el botón de compartir
3. Selecciona "Añadir a la pantalla de inicio"

### En escritorio (Chrome/Edge):
1. Busca el icono de instalación en la barra de direcciones
2. Haz clic en "Instalar"

## Desarrollo

Para probar la PWA en local:

```bash
# Modo desarrollo
bun run dev

# Build para producción
bun run build

# Preview del build
bun run preview
```

**Importante**: El Service Worker solo funciona en producción (build) o con HTTPS. En desarrollo, algunas funciones PWA pueden no estar disponibles.

## Despliegue

Al desplegar en producción, asegúrate de que:

1. Los iconos PNG estén en `/public`
2. El servidor sirva los archivos con HTTPS
3. El manifest.json sea accesible
4. El service worker se registre correctamente

## Mejoras futuras

- [ ] Notificaciones push
- [ ] Sincronización en segundo plano
- [ ] Actualización automática de contenido
- [ ] Soporte para instalación personalizada
