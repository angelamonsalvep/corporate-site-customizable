# 🌐 Corporate Site Customizable

**Una solución web moderna, profesional y 100% autogestionable para empresas de servicios.**

Este proyecto es una plataforma web corporativa diseñada para empresas que necesitan una presencia digital de alto impacto, con un panel administrativo intuitivo que permite cambiar cualquier aspecto del sitio sin tocar una sola línea de código.

---

## ✨ Características Principales

- **🎨 Personalización en Tiempo Real**: Cambia logos, paleta de colores, tipografías y textos directamente desde el panel de control.
- **📱 Mobile First & Responsive**: Optimizado para una experiencia perfecta en smartphones, tablets y ordenadores.
- **💼 Gestión de Catálogo**: Secciones dinámicas para Productos Comerciales y Servicios Financieros.
- **🤝 Red de Aliados**: Módulo dedicado para gestionar socios estratégicos con descripciones enriquecidas.
- **🌍 Multilingüe Ready**: Sistema de traducción integrado para Español, Inglés, Portugués, Francés y Chino.
- **🔐 Seguridad de Datos**: Panel administrativo protegido con cifrado de contraseñas y sistema de recuperación.
- **☁️ Gestión de Medios**: Integración con **Cloudinary** para subir y optimizar imágenes automáticamente.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend**: [React.js](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Estado y Contexto**: React Context API para una gestión de datos fluida.
- **Estilos**: Vanilla CSS con variables modernas (Modern Design System).
- **Backend**: Vercel Serverless Functions.
- **Base de Datos**: MongoDB para persistencia de contenido.
- **Imágenes**: Cloudinary API.

---

## 🚀 Inicio Rápido

### Requisitos Previos

- [Node.js](https://nodejs.org/) (v16 o superior)
- Una cuenta en [Cloudinary](https://cloudinary.com/) (para el panel de imágenes).
- Una base de datos en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

### Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/angelamonsalvep/corporate-site-customizable.git
   cd corporate-site-customizable
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Crea un archivo `.env` en la raíz con el siguiente formato:
   ```env
   # Cloudinary Config
   VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=tu_preset

   # La URL de la API (en desarrollo suele ser local)
   VITE_API_URL=http://localhost:3000/api
   ```

4. **Correr en desarrollo:**
   ```bash
   npm run dev
   ```

---

## 🛠️ Administración

Para acceder al panel de administración, navega a `/admin` en tu navegador. 

**Desde allí podrás:**
- Actualizar la información de contacto (WhatsApp, Email, Dirección).
- Modificar el Hero (título e imágenes de fondo).
- Añadir o quitar productos y servicios.
- Cambiar el logo y el isotipo de la pestaña del navegador.
- Gestionar la visibilidad de secciones completas.

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Puedes usarlo, modificarlo y distribuirlo libremente para tus proyectos personales o comerciales.

---

**Desarrollado con ❤️ para empresas que buscan excelencia digital.**
