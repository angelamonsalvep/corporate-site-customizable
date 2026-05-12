# 🌐 Corporate Site Customizable

**Una solución web corporativa profesional, dinámica y gestionable para empresas de servicios y comercio.**

Este proyecto es una plataforma web personalizable diseñada para empresas que buscan una presencia digital sólida. Permite a los administradores gestionar el contenido principal del sitio, catálogos de servicios y aliados estratégicos desde un panel de control integrado, asegurando que la información esté siempre actualizada sin necesidad de conocimientos técnicos.

---

## ✨ Características Principales

- **⚙️ Panel Administrativo**: Gestión centralizada de todo el contenido del sitio desde `/admin`.
- **🖼️ Gestión de Marca**: Cambia el logotipo principal, el logotipo secundario y el isotipo del navegador (favicon) de forma dinámica.
- **📱 Mobile First & Responsive**: Diseño moderno y fluido que se adapta perfectamente a cualquier dispositivo.
- **🛍️ Catálogo de Productos y Servicios**: 
  - Gestión de **Área Comercial** para productos con imágenes y descripciones.
  - Gestión de **Área Financiera** con soporte para listas de ítems detallados por servicio.
- **🤝 Módulo de Aliados**: Sección dedicada para partners corporativos con soporte para formato de texto enriquecido (listas y negritas).
- **🌍 Sistema Multilingüe**: Soporte integrado para 5 idiomas (Español, Inglés, Portugués, Francés y Chino).
- **🔒 Seguridad**: Acceso protegido al panel mediante contraseña y pregunta de recuperación.
- **☁️ Integración con Cloudinary**: Sube imágenes directamente desde el panel y gestiónalas en una galería centralizada.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend**: [React.js](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Gestión de Datos**: React Context API para sincronización de contenido en tiempo real.
- **Estilos**: Vanilla CSS con un sistema de diseño basado en variables para máxima ligereza.
- **Backend**: Vercel Serverless Functions.
- **Base de Datos**: MongoDB (para persistencia de configuraciones y contenido).
- **Imágenes**: Cloudinary API (almacenamiento en la nube).

---

## 🚀 Inicio Rápido

### Requisitos Previos

- [Node.js](https://nodejs.org/) (v16 o superior)
- Una instancia de MongoDB (local o Atlas).
- Cuenta de Cloudinary para la gestión de imágenes.

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
   Crea un archivo `.env` en la raíz (puedes guiarte por `.env.example` en la carpeta `api/`):
   ```env
   VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=tu_preset
   ```

4. **Correr en desarrollo:**
   ```bash
   npm run dev
   ```

---

## 🛠️ Administración de Contenido

Para gestionar el sitio, accede a la ruta `/admin`. Las secciones disponibles para personalizar son:

- **General & Contacto**: Datos de la empresa, redes sociales y visibilidad de botones de contacto.
- **Sección Hero**: Título principal, subtítulo e imagen de fondo de la cabecera.
- **Quiénes Somos**: Descripción corporativa e imagen representativa.
- **Áreas de Negocio**: Gestión completa de los productos y servicios financieros que ofrece la empresa.
- **Aliados Estratégicos**: Gestión de partners y colaboraciones.
- **Seguridad**: Cambio de credenciales de acceso.

---

## 📄 Licencia

Este proyecto se distribuye bajo la Licencia MIT.

---

**Desarrollado para potenciar la identidad digital de empresas globales.**
