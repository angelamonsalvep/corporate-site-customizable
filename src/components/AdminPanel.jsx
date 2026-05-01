import { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
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

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (e.g., max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('La imagen es demasiado grande. Por favor, sube un archivo menor a 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          general: {
            ...prev.general,
            logoImage: reader.result
          }
        }));
      };
      reader.readAsDataURL(file);
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
      const res = await fetch('http://localhost:3001/api/verify-password', {
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
      <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh',backgroundColor:'#f8fafc',fontFamily:'var(--font-body)'}}>
        <div style={{background:'white',padding:'3rem',borderRadius:'8px',boxShadow:'var(--shadow-sm)',width:'100%',maxWidth:'400px'}}>
          <h2 style={{marginBottom:'1.5rem',color:'var(--color-primary)',textAlign:'center'}}>Ingreso al Panel</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Contraseña Administrativa</label>
              <input type="password" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} className="form-control" autoFocus required />
            </div>
            {loginError && <p style={{color:'#991b1b',marginBottom:'1rem',backgroundColor:'#fee2e2',padding:'0.5rem',borderRadius:'4px'}}>{loginError}</p>}
            <button type="submit" className="btn btn-primary" style={{width:'100%'}}>Ingresar</button>
            <a href="/" style={{display:'block',textAlign:'center',marginTop:'1.5rem',color:'var(--color-text-muted)'}}>Volver al sitio web</a>
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
            <div style={{display:'flex',gap:'1rem'}}>
              <a href="/" className="btn btn-outline" style={{borderColor: 'white', color: 'white'}}>Ver Sitio Web</a>
              <button onClick={handleLogout} className="btn" style={{backgroundColor:'rgba(255,255,255,0.1)',color:'white'}}>Cerrar Sesión</button>
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
                <div className="form-group">
                  <label>Nombre de la Empresa</label>
                  <input type="text" className="form-control" value={formData.general.companyName} onChange={(e) => handleChange('general', 'companyName', e.target.value)} />
                </div>
                
                <div className="form-group">
                  <label>Logo del Sitio (Pega una URL o sube una imagen)</label>
                  <input type="text" className="form-control" placeholder="URL de la imagen (Opcional)" value={formData.general.logoImage || ''} onChange={(e) => handleChange('general', 'logoImage', e.target.value)} />
                  <div style={{marginTop: '0.5rem'}}>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="form-control" style={{padding: '0.4rem'}} />
                  </div>
                  <small style={{color: 'var(--color-text-muted)'}}>Recomendado: Imagen en formato PNG con fondo transparente (Máx 2MB).</small>
                  {formData.general.logoImage && (
                    <div style={{marginTop: '1rem', padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: '4px', display: 'inline-block'}}>
                      <img src={formData.general.logoImage} alt="Logo Preview" style={{maxHeight: '60px', objectFit: 'contain'}} />
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
                        <label>URL de Imagen</label>
                        <input type="text" className="form-control" value={product.image} onChange={(e) => handleArrayChange('trade', 'products', index, 'image', e.target.value)} />
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
                    <div key={service.id} className="admin-item-card">
                      <h3>Servicio {index + 1}</h3>
                      <div className="form-group">
                        <label>Nombre del Servicio</label>
                        <input type="text" className="form-control" value={service.name} onChange={(e) => handleArrayChange('financial', 'services', index, 'name', e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Imagen del Servicio (URL)</label>
                        <input type="text" className="form-control" value={service.image || ''} onChange={(e) => handleArrayChange('financial', 'services', index, 'image', e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Descripción del Servicio</label>
                        <textarea className="form-control" rows="2" value={service.description} onChange={(e) => handleArrayChange('financial', 'services', index, 'description', e.target.value)}></textarea>
                      </div>
                    </div>
                  ))}
                </div>
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
    </div>
  );
};

export default AdminPanel;
