# 🌐 Corporate Site Customizable

**Plataforma web profesional y autogestionable para empresas de servicios y comercio.**

Este proyecto permite a empresas corporativas mantener una presencia digital moderna con un panel administrativo integrado. Los administradores pueden actualizar la información clave, catálogos de servicios y aliados estratégicos de forma sencilla, asegurando una comunicación fluida con sus clientes.

---

## ✨ Características Principales

- **⚙️ Panel de Administración**: Acceso privado en `/admin` para gestionar todo el contenido.
- **🖼️ Gestión de Identidad**: Personalización del Logo principal, Isotipo (favicon) y elementos visuales de la marca.
- **📱 Diseño Responsivo**: Interfaz optimizada para móviles, tablets y escritorio.
- **🛍️ Catálogos Dinámicos**:
  - **Sección Comercial**: Listado de productos con imagen, título y descripción.
  - **Sección Financiera**: Servicios detallados con soporte para listas de características (sub-ítems).
- **🤝 Red de Aliados**: Módulo para mostrar socios estratégicos con descripciones formateadas.
- **🌍 Soporte Multiidioma**: Interfaz traducida a Español, Inglés, Portugués, Francés y Chino.
- **🔒 Seguridad Administrativa**: Control de acceso mediante contraseña y pregunta de seguridad para recuperación.
- **☁️ Galería Multimedia**: Integración con Cloudinary para la carga y gestión de imágenes desde el panel.

---

## 🛠️ Tecnologías

- **Frontend**: React.js (Vite)
- **Backend**: Node.js + Express (API)
- **Base de Datos**: MongoDB (Persistencia de contenido)
- **Estilos**: Vanilla CSS (Modern Design)
- **Despliegue**: Preparado para Vercel (Configuración mediante `vercel.json`)
- **Imágenes**: Cloudinary API

---

## 🚀 Instalación y Configuración

### Requisitos

- Node.js instalado.
- Base de Datos MongoDB activa.
- Credenciales de Cloudinary.

### Pasos

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Variables de Entorno:**
   Configura un archivo `.env` en la raíz con tus credenciales de Cloudinary y la URL de la API:
   ```env
   VITE_CLOUDINARY_CLOUD_NAME=tu_usuario
   VITE_CLOUDINARY_UPLOAD_PRESET=tu_preset
   ```

3. **Iniciar el proyecto:**
   - Desarrollo (Frontend + Backend): `npm run dev:all`
   - Solo Frontend: `npm run dev`
   - Solo API: `npm run dev:server`

---

## 📄 Licencia

MIT License.

---

**Solución integral para la transformación digital de empresas corporativas.**
