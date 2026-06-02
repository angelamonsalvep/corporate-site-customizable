# 🌐 Corporate Site Customizable

**Plataforma web profesional, dinámica y autogestionable para empresas de servicios y comercio.**

[![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Vite](https://img.shields.io/badge/Tool-Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Cloudinary](https://img.shields.io/badge/Storage-Cloudinary-3448C5?logo=cloudinary&logoColor=white)](https://cloudinary.com/)

Este proyecto proporciona una infraestructura base para desplegar sitios corporativos modernos con un panel administrativo integrado. Permite la gestión total de contenidos, desde la identidad visual hasta catálogos de servicios y aliados estratégicos.

---

## ✨ Características Principales

- **⚙️ Panel Administrativo Robusto**: Acceso privado en `/admin` para gestionar contenido en tiempo real sin necesidad de tocar código.
- **🖼️ Identidad Visual Flexible**: Personalización de logotipos, isotipos y temas visuales directamente desde el panel.
- **🛍️ Catálogos de Negocio**: 
  - **Áreas Comerciales**: Gestión de productos y bienes.
  - **Áreas Financieras**: Gestión de servicios y consultoría.
- **🤝 Red de Aliados**: Módulo dinámico para socios estratégicos con soporte para descripciones enriquecidas.
- **🌍 Soporte Multiidioma**: Interfaz preparada para 5 idiomas, permitiendo alcance global.
- **☁️ Gestión Multimedia**: Integración nativa con Cloudinary para optimización y almacenamiento de imágenes.
- **🔑 Seguridad Integrada**: Sistema de autenticación con hashing de contraseñas y preguntas de seguridad.

---

## 🛠️ Tecnologías

| Capa | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Frontend** | React.js (Vite) | Interfaz de usuario rápida y reactiva. |
| **Backend** | Node.js + Express | API REST para gestión de datos. |
| **Base de Datos** | MongoDB | Persistencia flexible basada en documentos. |
| **Multimedia** | Cloudinary | CDN y optimización de activos visuales. |
| **Estilos** | CSS Moderno | Diseño responsive y adaptable. |

---

## 🚀 Configuración del Entorno

El proyecto se divide en un cliente (Frontend) y un servidor (API). Ambos requieren configuración independiente.

### 1. Frontend (`/.env`)

Crea un archivo `.env` en la raíz del proyecto:

```env
# Cloudinary (Configuración pública para el widget de subida)
VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=tu_preset
```

### 2. Backend (`/api/.env`)

Crea un archivo `.env` dentro de la carpeta `/api`:

```env
# Cloudinary (Credenciales privadas para el servidor)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
CLOUDINARY_FOLDER=nombre_de_carpeta_del_cliente

# Identificación del Cliente (Controla qué seed se carga)
CLIENT_ID=world_trading_corp  # Debe coincidir con el nombre del archivo en api/seeds/
DB_NAME=world_trading_corp    # Nombre de la base de datos en MongoDB

# Base de Datos MongoDB
MONGO_URL=mongodb+srv://usuario:password@cluster.mongodb.net/
MONGO_PARAMS=retryWrites=true&w=majority
```

---

## 💻 Instalación y Puesta en Marcha

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Inicializar la Base de Datos (Seed):**
   Este paso es crítico para crear el primer administrador. Ejecuta el script de semillas:
   ```bash
   cd api
   node seed.js
   ```
   > [!IMPORTANT]
   > El script generará una **contraseña aleatoria única** para el acceso administrativo inicial. Asegúrate de copiarla de la terminal.

3. **Ejecución en Desarrollo:**
   Vuelve a la raíz y lanza ambos servicios simultáneamente:
   ```bash
   npm run dev:all
   ```

---

## 🎨 Personalización por Cliente

El sistema está diseñado para ser multi-tenencia mediante archivos de configuración:

1. **Archivos Seed**: Ubicados en `api/seeds/`. Puedes crear un archivo `mi_empresa.json` siguiendo el esquema de `generic.json`.
2. **Activación**: Cambia el `CLIENT_ID` en `api/.env` para que coincida con tu archivo JSON.
3. **Re-Seeding**: Si deseas sobrescribir una base de datos existente con el archivo JSON actualizado, usa:
   ```bash
   node seed.js --force
   ```

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

**Desarrollado para la transformación digital y escalabilidad empresarial.**
