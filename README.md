# 🌐 Corporate Site Customizable

**Plataforma web profesional y autogestionable para empresas de servicios y comercio.**

Este proyecto permite a empresas corporativas mantener una presencia digital moderna con un panel administrativo integrado. Los administradores pueden actualizar la información clave, catálogos de servicios y aliados estratégicos de forma sencilla.

---

## ✨ Características Principales

- **⚙️ Panel de Administración**: Acceso privado en `/admin` para gestionar todo el contenido.
- **🖼️ Gestión de Identidad**: Personalización de logotipos e isotipos (favicon).
- **🛍️ Catálogos Dinámicos**: Gestión de Áreas Comerciales (productos) y Financieras (servicios).
- **🤝 Red de Aliados**: Módulo para socios estratégicos con soporte para formato de texto.
- **🌍 Soporte Multiidioma**: Interfaz disponible en 5 idiomas.
- **☁️ Galería Multimedia**: Integración con Cloudinary para gestión de imágenes.

---

## 🛠️ Tecnologías

- **Frontend**: React.js (Vite)
- **Backend**: Node.js + Express (API)
- **Base de Datos**: MongoDB (Persistencia de contenido y seguridad)
- **Imágenes**: Cloudinary API

---

## 🚀 Configuración del Proyecto

El proyecto requiere la configuración de variables de entorno tanto para el **Frontend** como para el **Backend (API)**.

### 1. Variables del Frontend (Raíz `/.env`)
Configura estas variables para el funcionamiento de la interfaz de usuario:

```env
# Cloudinary (Solo datos públicos para el widget de subida)
VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=tu_preset
```

### 2. Variables del Backend (Carpeta `/api/.env`)
Configura estas variables para la lógica del servidor, base de datos e imágenes:

```env
# Cloudinary (Credenciales completas para el servidor)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
CLOUDINARY_FOLDER=nombre_de_carpeta_del_cliente

# Identificación del Cliente
CLIENT_ID=id_unico_del_cliente  # ej: world_trading_corp
DB_NAME=nombre_de_la_db         # ej: world_trading_corp

# Base de Datos MongoDB
MONGO_URL=mongodb+srv://usuario:password@cluster.mongodb.net/
MONGO_PARAMS=retryWrites=true&w=majority
```

> [!IMPORTANT]
> **Seguridad**: El acceso al panel administrativo se gestiona directamente desde la base de datos (colección de contenido). No se utiliza una variable de entorno para la contraseña por motivos de seguridad. La configuración inicial se realiza mediante el sistema de semillas (seeds) o configuración manual en DB.

---

## 💻 Instalación y Uso

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar en modo desarrollo (Frontend + API):**
   ```bash
   npm run dev:all
   ```

---

## 📄 Licencia

MIT License.

---

**Solución integral para la transformación digital de empresas corporativas.**
