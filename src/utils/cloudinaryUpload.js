/**
 * Uploads a file to Cloudinary using an unsigned upload preset.
 * Credentials are loaded from VITE_ env variables.
 *
 * @param {File} file - The file to upload
 * @param {string} folder - Cloudinary folder path, e.g. "clientes/world-trading-corp"
 * @returns {Promise<string>} - The secure URL of the uploaded image
 */
export async function uploadToCloudinary(file, folder = '') {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary no está configurado. Revisa las variables de entorno VITE_CLOUDINARY_CLOUD_NAME y VITE_CLOUDINARY_UPLOAD_PRESET.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  if (folder) {
    formData.append('folder', folder);
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Error al subir imagen a Cloudinary');
  }

  const data = await response.json();
  return data.secure_url;
}
