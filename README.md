# 🎮 Matemática Didáctica

Una aplicación educativa interactiva para aprender descomposición de números y suma mediante valores posicionales (unidades, decenas, centenas y miles).

## 📋 Descripción

Matemática Didáctica es un juego educativo diseñado para ayudar a estudiantes a comprender la descomposición numérica y la suma de números de hasta 4 dígitos. Los estudiantes arrastran fichas de valores posicionales hacia zonas específicas, visualizando de forma concreta cómo se componen los números.

## ✨ Características

### 🎯 Modos de Juego
- **Modo Aleatorio**: Genera dos números aleatorios automáticamente
- **Modo Predefinido**: El usuario ingresa los números que desea practicar

### 🎪 Mecánicas de Juego
- **Drag & Drop**: Arrastra fichas de valores posicionales (unidades, decenas, centenas, miles)
- **Generadores Infinitos**: Las fichas se regeneran automáticamente al ser utilizadas
- **Validación en Tiempo Real**: Notificaciones cuando intentas agregar más fichas de las necesarias
- **Dos Fases**: Descompón el primer número, luego el segundo

### 🎨 Panel de Resultados
- Visualización de todas las fichas de ambos números juntas
- Animación de aparición secuencial de fichas
- Contador de cada tipo de valor posicional
- Botón para revelar el resultado de la suma
- Opción para jugar de nuevo

## 🚀 Tecnologías

- **React 19** - Biblioteca UI
- **TypeScript** - Type safety
- **Vite** (Rolldown variant) - Build tool y dev server
- **Framer Motion** - Animaciones y drag & drop
- **Tailwind CSS 4** - Estilos
- **shadcn/ui** - Componentes UI
- **react-hot-toast** - Notificaciones
- **Bun** - Package manager y runtime

## 🛠️ Instalación

```bash
# Clonar el repositorio
git clone https://github.com/JonathanBytes/didactic-math.git

# Navegar al directorio
cd didactic-math

# Instalar dependencias
bun install
```

## 🎮 Uso

### Desarrollo
```bash
bun dev
```
La aplicación estará disponible en `http://localhost:5173`

### Build para Producción
```bash
bun run build
```

### Preview de Producción
```bash
bun preview
```

## 🎯 Flujo de la Aplicación

1. **Setup Panel**: Usuario elige modo y configura números
2. **Game Panel - Número 1**: Descompone el primer número arrastrando fichas a la Zona 1
3. **Game Panel - Número 2**: Descompone el segundo número arrastrando fichas a la Zona 2
4. **Result Panel**: Visualiza todas las fichas juntas y revela la suma

## 🎨 Colores de Fichas

- 🟢 **Verde** (#10b981): Unidades
- 🔵 **Azul** (#3b82f6): Decenas
- 🟠 **Naranja** (#f59e0b): Centenas
- 🔴 **Rojo** (#ef4444): Miles

## 📝 Validaciones

- Solo permite soltar fichas en la zona correcta según el número actual
- Valida que no se agreguen más fichas de las necesarias
- Notifica al usuario con mensajes claros sobre errores
- Avanza automáticamente cuando se completa la descomposición correcta

## 🤝 Contribuciones

Las contribuciones son bienvenidas.

## 👨‍💻 Autor

**Jonathan Bytes**
- GitHub: [@JonathanBytes](https://github.com/JonathanBytes)