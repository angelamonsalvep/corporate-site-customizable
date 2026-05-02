import { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { uploadToCloudinary } from '../utils/cloudinaryUpload';
import CloudinaryGallery from './CloudinaryGallery';
import './AdminPanel.css';

const AdminPanel = () => {
  const { content, updateContent } = useContent();
  const [formData, setFormData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('general');
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!sessionStorage.getItem('adminPassword'));
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  const [uploadingField, setUploadingField] = useState(null); // tracks which field is uploading
  const [cloudinaryFolder, setCloudinaryFolder] = useState('');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryTarget, setGalleryTarget] = useState(null);

  useEffect(() => {
    // Fetch client-specific config
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.defaultCloudinaryFolder) {
          setCloudinaryFolder(data.defaultCloudinaryFolder);
        }
      })
      .catch(err => console.error("Error fetching config:", err));
  }, []);

  const openGallery = (target) => {
    setGalleryTarget(target);
    setIsGalleryOpen(true);
  };

  const handleGallerySelect = (url) => {
    if (!galleryTarget) return;

    if (galleryTarget.arrayKey) {
      setFormData(prev => {
        const updatedArray = [...prev[galleryTarget.section][galleryTarget.arrayKey]];
        updatedArray[galleryTarget.index] = { ...updatedArray[galleryTarget.index], [galleryTarget.field]: url };
        return { ...prev, [galleryTarget.section]: { ...prev[galleryTarget.section], [galleryTarget.arrayKey]: updatedArray } };
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [galleryTarget.section]: { ...prev[galleryTarget.section], [galleryTarget.field]: url }
      }));
    }

    setIsGalleryOpen(false);
    setGalleryTarget(null);
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingField('logo');
    try {
      const url = await uploadToCloudinary(file, cloudinaryFolder);
      setFormData(prev => ({ ...prev, general: { ...prev.general, logoImage: url } }));
    } catch (err) {
      alert('Error al subir logo: ' + err.message);
    } finally {
      setUploadingField(null);
    }
  };

  // Generic image uploader for array items (products / services) → Cloudinary
  const handleArrayImageUpload = async (section, arrayKey, index, field, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const uploadKey = `${section}-${arrayKey}-${index}`;
    setUploadingField(uploadKey);
    try {
      const url = await uploadToCloudinary(file, cloudinaryFolder);
      setFormData(prev => {
        const updatedArray = [...prev[section][arrayKey]];
        updatedArray[index] = { ...updatedArray[index], [field]: url };
        return { ...prev, [section]: { ...prev[section], [arrayKey]: updatedArray } };
      });
    } catch (err) {
      alert('Error al subir imagen: ' + err.message);
    } finally {
      setUploadingField(null);
    }
  };

  // Generic single image uploader (Hero, About) -> Cloudinary
  const handleSingleImageUpload = async (section, field, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const uploadKey = `${section}-${field}`;
    setUploadingField(uploadKey);
    try {
      const url = await uploadToCloudinary(file, cloudinaryFolder);
      setFormData(prev => ({
        ...prev,
        [section]: { ...prev[section], [field]: url }
      }));
    } catch (err) {
      alert(`Error al subir imagen de ${section}: ` + err.message);
    } finally {
      setUploadingField(null);
    }
  };

  useEffect(() => {
    if (content) {
      setFormData(JSON.parse(JSON.stringify(content))); // Deep copy
    }
  }, [content]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });
      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem('adminPassword', passwordInput);
        setIsAuthenticated(true);
      } else {
        setLoginError('Contraseña incorrecta');
      }
    } catch (err) {
      setLoginError('Error de conexión al servidor');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminPassword');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8fafc', fontFamily: 'var(--font-body)' }}>
        <div style={{ background: 'white', padding: '3rem', borderRadius: '8px', boxShadow: 'var(--shadow-sm)', width: '100%', maxWidth: '400px' }}>
          <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)', textAlign: 'center' }}>Ingreso al Panel</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Contraseña Administrativa</label>
              <input type="password" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} className="form-control" autoFocus required />
            </div>
            {loginError && <p style={{ color: '#991b1b', marginBottom: '1rem', backgroundColor: '#fee2e2', padding: '0.5rem', borderRadius: '4px' }}>{loginError}</p>}
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Ingresar</button>
            <a href="/" style={{ display: 'block', textAlign: 'center', marginTop: '1.5rem', color: 'var(--color-text-muted)' }}>Volver al sitio web</a>
          </form>
        </div>
      </div>
    );
  }

  if (!formData) return <div className="admin-loading">Cargando datos...</div>;

  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (section, arrayName, index, field, value) => {
    setFormData(prev => {
      const newArray = [...prev[section][arrayName]];
      newArray[index] = { ...newArray[index], [field]: value };
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [arrayName]: newArray
        }
      };
    });
  };

  // Add a new item to an array field (e.g. financial.services)
  const handleAddArrayItem = (section, arrayName, template) => {
    setFormData(prev => {
      const currentArray = prev[section][arrayName] || [];
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [arrayName]: [...currentArray, { ...template, id: `${arrayName.charAt(0)}${Date.now()}`, visible: true }]
        }
      };
    });
  };

  // Remove an item from an array field
  const handleRemoveArrayItem = (section, arrayName, index) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer una vez guardes los cambios.')) return;
    setFormData(prev => {
      const newArray = prev[section][arrayName].filter((_, i) => i !== index);
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [arrayName]: newArray
        }
      };
    });
  };

  // Toggle visibility of an array item
  const handleToggleVisibility = (section, arrayName, index) => {
    setFormData(prev => {
      const newArray = [...prev[section][arrayName]];
      newArray[index] = { ...newArray[index], visible: newArray[index].visible === false ? true : false };
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [arrayName]: newArray
        }
      };
    });
  };

  // Move an item up or down in the array
  const handleMoveArrayItem = (section, arrayName, index, direction) => {
    setFormData(prev => {
      const newArray = [...prev[section][arrayName]];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newArray.length) return prev;
      [newArray[index], newArray[targetIndex]] = [newArray[targetIndex], newArray[index]];
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [arrayName]: newArray
        }
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    const result = await updateContent(formData);

    setIsSaving(false);
    if (result.success) {
      setMessage('¡Cambios guardados con éxito! Puedes verlos en la página principal.');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('Error al guardar: ' + result.error);
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <div className="container">
          <div className="header-content">
            <h1>Panel de Administración</h1>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="/" className="btn btn-outline" style={{ borderColor: 'white', color: 'white' }}>Ver Sitio Web</a>
              <button onClick={handleLogout} className="btn" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }}>Cerrar Sesión</button>
            </div>
          </div>
        </div>
      </div>

      <div className="container admin-container">
        <div className="admin-sidebar">
          <button className={activeTab === 'general' ? 'active' : ''} onClick={() => setActiveTab('general')}>General & Contacto</button>
          <button className={activeTab === 'hero' ? 'active' : ''} onClick={() => setActiveTab('hero')}>Sección Principal (Hero)</button>
          <button className={activeTab === 'about' ? 'active' : ''} onClick={() => setActiveTab('about')}>Quiénes Somos</button>
          <button className={activeTab === 'trade' ? 'active' : ''} onClick={() => setActiveTab('trade')}>Área Comercial</button>
          <button className={activeTab === 'financial' ? 'active' : ''} onClick={() => setActiveTab('financial')}>Área Financiera</button>
        </div>

        <div className="admin-content">
          {message && (
            <div className={`admin-message ${message.includes('Error') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* GENERAL & CONTACT TAB */}
            {activeTab === 'general' && (
              <div className="admin-section animate-fade-in">
                <h2>Información General</h2>

                {/* Cloudinary folder config */}
                <div className="form-group" style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' }}>
                  <label style={{ color: '#0369a1', fontWeight: 700 }}>📁 Carpeta en Cloudinary (para imágenes de este cliente)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={cloudinaryFolder}
                    onChange={(e) => setCloudinaryFolder(e.target.value)}
                    placeholder="clientes/nombre-cliente"
                  />
                  <small style={{ color: '#0369a1' }}>Las imágenes que subas irán a esta carpeta en Cloudinary.</small>
                </div>

                <div className="form-group">
                  <label>Nombre de la Empresa</label>
                  <input type="text" className="form-control" value={formData.general.companyName} onChange={(e) => handleChange('general', 'companyName', e.target.value)} />
                </div>

                <div className="form-group">
                  <label>Logo del Sitio (Pega una URL o sube una imagen)</label>
                  <input type="text" className="form-control" placeholder="URL de la imagen (Opcional)" value={formData.general.logoImage || ''} onChange={(e) => handleChange('general', 'logoImage', e.target.value)} />
                  <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="form-control"
                      style={{ padding: '0.4rem', flex: 1, minWidth: '200px' }}
                      disabled={uploadingField === 'logo'}
                    />
                    <button type="button" className="btn btn-outline" style={{ padding: '0.4rem 1rem' }} onClick={() => openGallery({ section: 'general', field: 'logoImage' })}>
                      🖼️ Elegir de Cloudinary
                    </button>
                    {uploadingField === 'logo' && <small style={{ color: '#0369a1', width: '100%' }}>⏳ Subiendo a Cloudinary...</small>}
                  </div>
                  <small style={{ color: 'var(--color-text-muted)' }}>Recomendado: Imagen en formato PNG con fondo transparente.</small>
                  {formData.general.logoImage && (
                    <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: '4px', display: 'inline-block' }}>
                      <img src={formData.general.logoImage} alt="Logo Preview" style={{ maxHeight: '60px', objectFit: 'contain' }} />
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Isotipo / Icono de Marca (Ej: Solo el mundo)</label>
                  <input type="text" className="form-control" value={formData.general.brandIcon || ''} onChange={(e) => handleChange('general', 'brandIcon', e.target.value)} />
                  <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSingleImageUpload('general', 'brandIcon', e)}
                      className="form-control"
                      style={{ padding: '0.4rem', flex: 1, minWidth: '200px' }}
                      disabled={uploadingField === 'general-brandIcon'}
                    />
                    <button type="button" className="btn btn-outline" style={{ padding: '0.4rem 1rem' }} onClick={() => openGallery({ section: 'general', field: 'brandIcon' })}>
                      🖼️ Elegir Isotipo
                    </button>
                    {uploadingField === 'general-brandIcon' && <small style={{ color: '#0369a1', width: '100%' }}>⏳ Subiendo...</small>}
                  </div>
                  
                  <div className="form-group" style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px dashed #cbd5e1', marginTop: '1rem' }}>
                  <label style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Vista Previa en Navegador</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '0.5rem' }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      backgroundColor: 'white', 
                      borderRadius: '8px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      border: '1px solid #e2e8f0'
                    }}>
                      <img 
                        src={formData.general.brandIcon || formData.general.logoImage || formData.general.secondaryLogo || '/favicon.ico'} 
                        alt="Favicon" 
                        style={{ width: '24px', height: '24px', objectFit: 'contain' }} 
                      />
                    </div>
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.9rem', color: '#1e293b' }}>Icono del Sitio Actual</strong>
                      <small style={{ color: '#64748b' }}>Así es como se ve la marca en la pestaña del navegador.</small>
                    </div>
                  </div>
                </div>

                </div>

                <div className="form-group">
                  <label>Logo Secundario (Ej: 3D o con reflejo)</label>
                  <input type="text" className="form-control" value={formData.general.secondaryLogo || ''} onChange={(e) => handleChange('general', 'secondaryLogo', e.target.value)} />
                  <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSingleImageUpload('general', 'secondaryLogo', e)}
                      className="form-control"
                      style={{ padding: '0.4rem', flex: 1, minWidth: '200px' }}
                      disabled={uploadingField === 'general-secondaryLogo'}
                    />
                    <button type="button" className="btn btn-outline" style={{ padding: '0.4rem 1rem' }} onClick={() => openGallery({ section: 'general', field: 'secondaryLogo' })}>
                      🖼️ Elegir Logo 2
                    </button>
                    {uploadingField === 'general-secondaryLogo' && <small style={{ color: '#0369a1', width: '100%' }}>⏳ Subiendo...</small>}
                  </div>
                  {formData.general.secondaryLogo && (
                    <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: '4px', display: 'inline-block' }}>
                      <img src={formData.general.secondaryLogo} alt="Logo 2 Preview" style={{ maxHeight: '60px', objectFit: 'contain' }} />
                    </div>
                  )}
                </div>

                <h2 className="mt-4">Contacto</h2>
                <div className="form-group">
                  <label>Número de WhatsApp (Ej: 573001234567)</label>
                  <input type="text" className="form-control" value={formData.contact.whatsappNumber} onChange={(e) => handleChange('contact', 'whatsappNumber', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Teléfono Visible (Ej: +57 300 000 0000)</label>
                  <input type="text" className="form-control" value={formData.contact.phoneDisplay} onChange={(e) => handleChange('contact', 'phoneDisplay', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Correo Electrónico</label>
                  <input type="email" className="form-control" value={formData.contact.email} onChange={(e) => handleChange('contact', 'email', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Dirección</label>
                  <input type="text" className="form-control" value={formData.contact.address} onChange={(e) => handleChange('contact', 'address', e.target.value)} />
                </div>

                <div className="form-group" style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginTop: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 500 }}>
                    <input
                      type="checkbox"
                      checked={formData.contact.showWhatsApp !== false}
                      onChange={(e) => handleChange('contact', 'showWhatsApp', e.target.checked)}
                    />
                    Habilitar Botón WhatsApp
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 500 }}>
                    <input
                      type="checkbox"
                      checked={formData.contact.showPhone !== false}
                      onChange={(e) => handleChange('contact', 'showPhone', e.target.checked)}
                    />
                    Mostrar Teléfono en el Sitio
                  </label>
                </div>
              </div>
            )}

            {/* HERO TAB */}
            {activeTab === 'hero' && (
              <div className="admin-section animate-fade-in">
                <h2>Sección Principal (Hero)</h2>
                <div className="form-group">
                  <label>Título Principal</label>
                  <input type="text" className="form-control" value={formData.hero.title} onChange={(e) => handleChange('hero', 'title', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Subtítulo</label>
                  <textarea className="form-control" rows="3" value={formData.hero.subtitle} onChange={(e) => handleChange('hero', 'subtitle', e.target.value)}></textarea>
                </div>
                <div className="form-group">
                  <label>URL de Imagen de Fondo</label>
                  <input type="text" className="form-control" value={formData.hero.backgroundImage} onChange={(e) => handleChange('hero', 'backgroundImage', e.target.value)} />
                  <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSingleImageUpload('hero', 'backgroundImage', e)}
                      className="form-control"
                      style={{ padding: '0.4rem', flex: 1, minWidth: '200px' }}
                      disabled={uploadingField === 'hero-backgroundImage'}
                    />
                    <button type="button" className="btn btn-outline" style={{ padding: '0.4rem 1rem' }} onClick={() => openGallery({ section: 'hero', field: 'backgroundImage' })}>
                      🖼️ Elegir de Cloudinary
                    </button>
                    {uploadingField === 'hero-backgroundImage' && <small style={{ color: '#0369a1', width: '100%' }}>⏳ Subiendo a Cloudinary...</small>}
                  </div>
                  {formData.hero.backgroundImage && (
                    <img src={formData.hero.backgroundImage} alt="Preview" className="img-preview" />
                  )}
                </div>
              </div>
            )}

            {/* ABOUT TAB */}
            {activeTab === 'about' && (
              <div className="admin-section animate-fade-in">
                <h2>Quiénes Somos</h2>
                <div className="form-group">
                  <label>Título de la Sección</label>
                  <input type="text" className="form-control" value={formData.about.title} onChange={(e) => handleChange('about', 'title', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Párrafo 1</label>
                  <textarea className="form-control" rows="4" value={formData.about.description[0]} onChange={(e) => {
                    const newDesc = [...formData.about.description];
                    newDesc[0] = e.target.value;
                    handleChange('about', 'description', newDesc);
                  }}></textarea>
                </div>
                <div className="form-group">
                  <label>URL de Imagen</label>
                  <input type="text" className="form-control" value={formData.about.image} onChange={(e) => handleChange('about', 'image', e.target.value)} />
                  <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSingleImageUpload('about', 'image', e)}
                      className="form-control"
                      style={{ padding: '0.4rem', flex: 1, minWidth: '200px' }}
                      disabled={uploadingField === 'about-image'}
                    />
                    <button type="button" className="btn btn-outline" style={{ padding: '0.4rem 1rem' }} onClick={() => openGallery({ section: 'about', field: 'image' })}>
                      🖼️ Elegir de Cloudinary
                    </button>
                    {uploadingField === 'about-image' && <small style={{ color: '#0369a1', width: '100%' }}>⏳ Subiendo a Cloudinary...</small>}
                  </div>
                  {formData.about.image && (
                    <img src={formData.about.image} alt="Preview" className="img-preview" />
                  )}
                </div>
              </div>
            )}

            {/* TRADE TAB */}
            {activeTab === 'trade' && (
              <div className="admin-section animate-fade-in">
                <h2>Área Comercial - Productos</h2>
                <div className="form-group">
                  <label>Título Principal</label>
                  <input type="text" className="form-control" value={formData.trade.title} onChange={(e) => handleChange('trade', 'title', e.target.value)} />
                </div>

                <div className="products-admin-list">
                  {formData.trade.products.map((product, index) => (
                    <div key={product.id} className="admin-item-card">
                      <h3>Producto {index + 1}</h3>
                      <div className="form-group">
                        <label>Nombre</label>
                        <input type="text" className="form-control" value={product.name} onChange={(e) => handleArrayChange('trade', 'products', index, 'name', e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Descripción</label>
                        <textarea className="form-control" rows="2" value={product.description} onChange={(e) => handleArrayChange('trade', 'products', index, 'description', e.target.value)}></textarea>
                      </div>
                      <div className="form-group">
                        <label>Imagen del Producto</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="URL de imagen (opcional)"
                          value={product.image}
                          onChange={(e) => handleArrayChange('trade', 'products', index, 'image', e.target.value)}
                        />
                        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                          <input
                            type="file"
                            accept="image/*"
                            className="form-control"
                            style={{ padding: '0.4rem', flex: 1, minWidth: '200px' }}
                            onChange={(e) => handleArrayImageUpload('trade', 'products', index, 'image', e)}
                            disabled={uploadingField === `trade-products-${index}`}
                          />
                          <button type="button" className="btn btn-outline" style={{ padding: '0.4rem 1rem' }} onClick={() => openGallery({ section: 'trade', arrayKey: 'products', index, field: 'image' })}>
                            🖼️ Elegir de Cloudinary
                          </button>
                          {uploadingField === `trade-products-${index}` && <small style={{ color: '#0369a1', width: '100%' }}>⏳ Subiendo a Cloudinary...</small>}
                        </div>
                        {product.image && (
                          <div style={{ marginTop: '0.75rem' }}>
                            <img src={product.image} alt={product.name} style={{ height: '80px', borderRadius: '6px', objectFit: 'cover' }} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FINANCIAL TAB */}
            {activeTab === 'financial' && (
              <div className="admin-section animate-fade-in">
                <h2>Área Financiera - Servicios</h2>
                <div className="form-group">
                  <label>Título Principal</label>
                  <input type="text" className="form-control" value={formData.financial.title} onChange={(e) => handleChange('financial', 'title', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Descripción General</label>
                  <textarea className="form-control" rows="2" value={formData.financial.description} onChange={(e) => handleChange('financial', 'description', e.target.value)}></textarea>
                </div>

                <div className="products-admin-list">
                  {formData.financial.services.map((service, index) => (
                    <div key={service.id || index} className={`admin-item-card ${service.visible === false ? 'admin-item-hidden' : ''}`}>
                      <div className="admin-item-header">
                        <h3>Servicio {index + 1}{service.visible === false && <span className="badge-hidden">Oculto</span>}</h3>
                        <div className="admin-item-actions">
                          <button type="button" title="Subir" className="btn-icon" onClick={() => handleMoveArrayItem('financial', 'services', index, 'up')} disabled={index === 0}>▲</button>
                          <button type="button" title="Bajar" className="btn-icon" onClick={() => handleMoveArrayItem('financial', 'services', index, 'down')} disabled={index === formData.financial.services.length - 1}>▼</button>
                          <button type="button" title={service.visible === false ? 'Mostrar en el sitio' : 'Ocultar del sitio'} className={`btn-icon ${service.visible === false ? 'btn-icon-warning' : 'btn-icon-muted'}`} onClick={() => handleToggleVisibility('financial', 'services', index)}>
                            {service.visible === false ? '👁️' : '🙈'}
                          </button>
                          <button type="button" title="Eliminar servicio" className="btn-icon btn-icon-danger" onClick={() => handleRemoveArrayItem('financial', 'services', index)}>🗑️</button>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Nombre del Servicio</label>
                        <input type="text" className="form-control" value={service.name} onChange={(e) => handleArrayChange('financial', 'services', index, 'name', e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Imagen del Servicio</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="URL de imagen (opcional)"
                          value={service.image || ''}
                          onChange={(e) => handleArrayChange('financial', 'services', index, 'image', e.target.value)}
                        />
                        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                          <input
                            type="file"
                            accept="image/*"
                            className="form-control"
                            style={{ padding: '0.4rem', flex: 1, minWidth: '200px' }}
                            onChange={(e) => handleArrayImageUpload('financial', 'services', index, 'image', e)}
                            disabled={uploadingField === `financial-services-${index}`}
                          />
                          <button type="button" className="btn btn-outline" style={{ padding: '0.4rem 1rem' }} onClick={() => openGallery({ section: 'financial', arrayKey: 'services', index, field: 'image' })}>
                            🖼️ Elegir de Cloudinary
                          </button>
                          {uploadingField === `financial-services-${index}` && <small style={{ color: '#0369a1', width: '100%' }}>⏳ Subiendo a Cloudinary...</small>}
                        </div>
                        {service.image && (
                          <div style={{ marginTop: '0.75rem' }}>
                            <img src={service.image} alt={service.name} style={{ height: '80px', borderRadius: '6px', objectFit: 'cover' }} />
                          </div>
                        )}
                      </div>
                      <div className="form-group">
                        <label>Descripción del Servicio (opcional)</label>
                        <textarea className="form-control" rows="2" value={service.description || ''} onChange={(e) => handleArrayChange('financial', 'services', index, 'description', e.target.value)} placeholder="Descripción general del servicio..."></textarea>
                      </div>

                      {/* Items / Sub-servicios */}
                      <div className="form-group">
                        <label>Ítems / Sub-servicios</label>
                        <small style={{ display: 'block', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Estos se muestran como lista al hacer clic en la tarjeta del servicio.</small>
                        <div className="admin-items-list">
                          {(service.items || []).map((item, itemIdx) => (
                            <div key={itemIdx} className="admin-subitem">
                              <span className="admin-subitem-bullet">•</span>
                              <input
                                type="text"
                                className="form-control"
                                value={item}
                                onChange={(e) => {
                                  const newItems = [...(service.items || [])];
                                  newItems[itemIdx] = e.target.value;
                                  handleArrayChange('financial', 'services', index, 'items', newItems);
                                }}
                                style={{ marginBottom: 0 }}
                              />
                              <button
                                type="button"
                                className="btn-icon btn-icon-danger"
                                title="Eliminar ítem"
                                onClick={() => {
                                  const newItems = (service.items || []).filter((_, i) => i !== itemIdx);
                                  handleArrayChange('financial', 'services', index, 'items', newItems);
                                }}
                              >✕</button>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          className="btn-add-subitem"
                          onClick={() => {
                            const newItems = [...(service.items || []), ''];
                            handleArrayChange('financial', 'services', index, 'items', newItems);
                          }}
                        >
                          + Agregar ítem
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="btn btn-add-item"
                  onClick={() => handleAddArrayItem('financial', 'services', { name: 'Nuevo Servicio', description: '', image: '', items: [] })}
                >
                  ＋ Agregar Servicio Financiero
                </button>
              </div>
            )}

            <div className="admin-actions">
              <button type="submit" className="btn btn-primary" disabled={isSaving}>
                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {isGalleryOpen && (
        <CloudinaryGallery
          folder={cloudinaryFolder}
          adminPassword={sessionStorage.getItem('adminPassword')}
          onSelect={handleGallerySelect}
          onClose={() => setIsGalleryOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminPanel;
