import { useState, useEffect } from 'react';
import './CloudinaryGallery.css';

const CloudinaryGallery = ({ folder, onSelect, onClose, adminPassword }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/cloudinary-gallery?folder=${encodeURIComponent(folder || '')}`, {
          headers: {
            'Authorization': `Bearer ${adminPassword}`
          }
        });
        const data = await res.json();
        
        if (data.success) {
          setImages(data.images);
        } else {
          setError(data.error || 'Error al cargar imágenes');
        }
      } catch (err) {
        setError('Error de conexión con el servidor');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [folder, adminPassword]);

  return (
    <div className="cloudinary-modal-overlay" onClick={onClose}>
      <div className="cloudinary-modal" onClick={e => e.stopPropagation()}>
        <div className="cloudinary-modal-header">
          <h3>Galería de Cloudinary</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="cloudinary-modal-content">
          <p className="gallery-info">
            Mostrando imágenes de la carpeta: <strong>{folder || 'Todas (Raíz)'}</strong>
          </p>

          {loading ? (
            <div className="gallery-loading">Cargando imágenes...</div>
          ) : error ? (
            <div className="gallery-error">{error}</div>
          ) : images.length === 0 ? (
            <div className="gallery-empty">No se encontraron imágenes en esta carpeta.</div>
          ) : (
            <div className="gallery-grid">
              {images.map(img => (
                <div 
                  key={img.asset_id} 
                  className="gallery-item"
                  onClick={() => onSelect(img.secure_url)}
                >
                  <img src={img.secure_url} alt={img.public_id} loading="lazy" />
                  <div className="gallery-item-hover">
                    <span>Seleccionar</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CloudinaryGallery;
