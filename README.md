# Corporate Site Customizable (Premium Edition)

Este proyecto es una plataforma web corporativa altamente personalizable, diseñada para empresas que buscan una presencia digital profesional y autogestionable.

## 🚀 Características Principales

- **Personalización Total**: Cambia logos, colores, textos e imágenes desde el panel administrativo.
- **Área Comercial y Financiera**: Secciones dedicadas para catálogos de productos y servicios con gestión de visibilidad.
- **Aliados Estratégicos**: Sección para mostrar partners y alianzas con soporte para Markdown.
- **Multilingüe**: Soporte para español, inglés, portugués, francés y chino.
- **Cloudinary Integration**: Gestión de imágenes profesional con galería integrada.

## 💎 Características Premium (Activadas en esta Rama)

Esta rama (`feature/seo-premium-suite`) incluye la **Suite de SEO Avanzado**:

- **Panel de Control SEO**: Gestión de Meta Titles, Meta Descriptions y Keywords dinámicas.
- **Open Graph (Social SEO)**: Configuración de `og:image` para compartir en redes sociales y WhatsApp.
- **Estructura de Datos**: Marcado Schema.org automático para buscadores.
- **Indexación**: Generación automática de `sitemap.xml` y `robots.txt`.

### Cómo activar las funciones Premium

Asegúrate de tener la siguiente variable en tu archivo `.env`:

```env
VITE_ENABLE_SEO_PREMIUM=true
```

## 🛠️ Tecnologías

- **Frontend**: React + Vite
- **Styling**: Vanilla CSS (Modern design)
- **Backend/API**: Vercel Serverless Functions + MongoDB
- **Hosting**: Vercel

## 📦 Instalación

1. Clonar el repositorio.
2. `npm install`
3. Configurar variables de entorno (MongoDB, Cloudinary).
4. `npm run dev`
