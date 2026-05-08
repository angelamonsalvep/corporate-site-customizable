import { useState, useEffect, useRef } from 'react';
import { useContent } from '../context/ContentContext';
import { uploadToCloudinary } from '../utils/cloudinaryUpload';
import CloudinaryGallery from './CloudinaryGallery';
import './AdminPanel.css';

const AdminPanel = () => {
  const { content, updateContent, updateContentSection, t } = useContent();
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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const contentRef = useRef(null);

  // Recovery related state
  const [showRecovery, setShowRecovery] = useState(false);
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [recoveryAnswer, setRecoveryAnswer] = useState('');
  const [newPasswordRecovery, setNewPasswordRecovery] = useState('');
  const [recoveryError, setRecoveryError] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState('');

  // Security tab state
  const [securityData, setSecurityData] = useState({
    newPassword: '',
    confirmPassword: '',
    securityQuestion: '',
    securityAnswer: ''
  });

  // Clear message after timeout
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [message]);

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
      const data = JSON.parse(JSON.stringify(content));
      if (!data.allies) data.allies = { title: '', description: '', items: [] };
      if (!data.allies.items) data.allies.items = [];
      setFormData(data); // Deep copy with defaults
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

  const handleForgotPassword = async () => {
    try {
      const res = await fetch('/api/admin/security-question');
      const data = await res.json();
      if (data.success) {
        setSecurityQuestion(data.question);
        setShowRecovery(true);
        setLoginError('');
      } else {
        setLoginError('No se ha configurado una pregunta de seguridad. Contacta al soporte.');
      }
    } catch (err) {
      setLoginError('Error al cargar pregunta de seguridad');
    }
  };

  const handleRecoverPassword = async (e) => {
    e.preventDefault();
    setRecoveryError('');
    setRecoverySuccess('');
    try {
      const res = await fetch('/api/admin/recover-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          answer: recoveryAnswer, 
          newPassword: newPasswordRecovery 
        })
      });
      const data = await res.json();
      if (data.success) {
        setRecoverySuccess('Contraseña restablecida. Ahora puedes ingresar.');
        setTimeout(() => {
          setShowRecovery(false);
          setRecoverySuccess('');
          setRecoveryAnswer('');
          setNewPasswordRecovery('');
        }, 3000);
      } else {
        setRecoveryError(data.error || 'Error al restablecer');
      }
    } catch (err) {
      setRecoveryError('Error de conexión');
    }
  };

  const handleUpdateSecurity = async (e) => {
    e.preventDefault();
    
    // Validaciones claras
    if (!securityData.newPassword) {
      setMessage('Error: Debes ingresar una nueva contraseña');
      return;
    }
    if (securityData.newPassword !== securityData.confirmPassword) {
      setMessage('Error: Las contraseñas no coinciden');
      return;
    }
    if (!securityData.securityQuestion || !securityData.securityAnswer) {
      setMessage('Error: Debes configurar la pregunta y respuesta de seguridad para poder recuperar tu cuenta después.');
      return;
    }

    setIsSaving(true);
    try {
      const password = sessionStorage.getItem('adminPassword');
      const res = await fetch('/api/admin/setup-security', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`
        },
        body: JSON.stringify(securityData)
      });
      const data = await res.json();
      if (data.success) {
        setMessage('✅ Seguridad actualizada correctamente. Tu nueva contraseña y pregunta de recuperación están activas.');
        setSecurityData({ newPassword: '', confirmPassword: '', securityQuestion: '', securityAnswer: '' });
        sessionStorage.setItem('adminPassword', securityData.newPassword);
      } else {
        setMessage('❌ Error: ' + (data.error || 'No se pudo actualizar'));
      }
    } catch (err) {
      setMessage('❌ Error de conexión al servidor');
    } finally {
      setIsSaving(false);
      if (contentRef.current) {
        contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminPassword');
    setPasswordInput(''); // Limpiar el cuadro de texto al cerrar sesión
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8fafc', fontFamily: 'var(--font-body)' }}>
        <div style={{ background: 'white', padding: '3rem', borderRadius: '8px', boxShadow: 'var(--shadow-sm)', width: '100%', maxWidth: '400px' }}>
          {!showRecovery ? (
            <>
              <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)', textAlign: 'center' }}>Ingreso al Panel</h2>
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label>Contraseña Administrativa</label>
                  <input type="password" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} className="form-control" autoFocus required />
                </div>
                {loginError && <p style={{ color: '#991b1b', marginBottom: '1rem', backgroundColor: '#fee2e2', padding: '0.5rem', borderRadius: '4px' }}>{loginError}</p>}
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Ingresar</button>
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                  <button type="button" onClick={handleForgotPassword} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.9rem' }}>
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <a href="/" style={{ display: 'block', textAlign: 'center', marginTop: '1.5rem', color: 'var(--color-text-muted)' }}>Volver al sitio web</a>
              </form>
            </>
          ) : (
            <>
              <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)', textAlign: 'center' }}>Recuperar Acceso</h2>
              <p style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: '#64748b' }}>Responde a tu pregunta de seguridad para restablecer la contraseña.</p>
              <form onSubmit={handleRecoverPassword}>
                <div className="form-group">
                  <label style={{ fontWeight: 600 }}>{securityQuestion}</label>
                  <input type="text" value={recoveryAnswer} onChange={e => setRecoveryAnswer(e.target.value)} className="form-control" placeholder="Tu respuesta..." required />
                </div>
                <div className="form-group">
                  <label>Nueva Contraseña</label>
                  <input type="password" value={newPasswordRecovery} onChange={e => setNewPasswordRecovery(e.target.value)} className="form-control" required />
                </div>
                {recoveryError && <p style={{ color: '#991b1b', marginBottom: '1rem', backgroundColor: '#fee2e2', padding: '0.5rem', borderRadius: '4px' }}>{recoveryError}</p>}
                {recoverySuccess && <p style={{ color: '#166534', marginBottom: '1rem', backgroundColor: '#dcfce7', padding: '0.5rem', borderRadius: '4px' }}>{recoverySuccess}</p>}
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Restablecer Contraseña</button>
                <button type="button" onClick={() => setShowRecovery(false)} style={{ width: '100%', background: 'none', border: 'none', marginTop: '1rem', cursor: 'pointer', color: '#64748b' }}>
                  Volver al Login
                </button>
              </form>
            </>
          )}
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

  const handleSaveSection = async (section) => {
    setIsSaving(true);
    setMessage('');
    
    // Preparar los datos de la sección. Algunos tabs manejan dos secciones del objeto content.
    let sectionsToUpdate = [section];
    if (section === 'general') sectionsToUpdate = ['general', 'contact'];

    try {
      for (const s of sectionsToUpdate) {
        const result = await updateContentSection(s, formData[s]);
        if (!result.success) {
          setMessage(`Error al guardar sección ${s}: ${result.error}`);
          setIsSaving(false);
          return;
        }
      }
      setMessage('✅ Sección guardada correctamente.');
    } catch (err) {
      setMessage('❌ Error al procesar el guardado.');
    } finally {
      setIsSaving(false);
      if (contentRef.current) {
        contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const selectTab = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    setMessage(''); // Clear message when switching tabs
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <div className="container">
          <div className="header-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button 
                className="admin-mobile-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? '✕' : '☰'}
              </button>
              <h1>{t('admin.panelTitle')}</h1>
            </div>
            <div className="header-actions">
              <a href="/" className="btn btn-outline btn-small">{t('admin.actions.viewSite')}</a>
              <button onClick={handleLogout} className="btn btn-small logout-btn">{t('admin.actions.logout')}</button>
            </div>
          </div>
        </div>
      </div>

      <div className="container admin-container">
        <div className={`admin-sidebar ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="sidebar-header">{t('admin.menuHeader')}</div>
          <button className={activeTab === 'general' ? 'active' : ''} onClick={() => selectTab('general')}>{t('admin.tabs.general')}</button>
          <button className={activeTab === 'hero' ? 'active' : ''} onClick={() => selectTab('hero')}>{t('admin.tabs.hero')}</button>
          <button className={activeTab === 'about' ? 'active' : ''} onClick={() => selectTab('about')}>{t('admin.tabs.about')}</button>
          <button className={activeTab === 'trade' ? 'active' : ''} onClick={() => selectTab('trade')}>{t('admin.tabs.trade')}</button>
          <button className={activeTab === 'financial' ? 'active' : ''} onClick={() => selectTab('financial')}>{t('admin.tabs.financial')}</button>
          <button className={activeTab === 'allies' ? 'active' : ''} onClick={() => selectTab('allies')}>{t('admin.tabs.allies')}</button>
          <button className={activeTab === 'security' ? 'active' : ''} onClick={() => selectTab('security')}>{t('admin.tabs.security')}</button>
        </div>
        
        {mobileMenuOpen && <div className="admin-sidebar-overlay" onClick={() => setMobileMenuOpen(false)}></div>}

        <div className="admin-content" ref={contentRef} style={{ position: 'relative' }}>
          {message && (
            <div className={`admin-message ${message.includes('Error') || message.includes('❌') ? 'error' : 'success'}`}>
              <div className="message-content">
                {message.includes('❌') || message.includes('Error') ? '⚠️' : '✅'} {message.replace('✅ ', '').replace('❌ ', '')}
              </div>
              <button className="message-close" onClick={() => setMessage('')} aria-label="Cerrar">✕</button>
            </div>
          )}

          <form onSubmit={(e) => e.preventDefault()}>

            {/* GENERAL & CONTACT TAB */}
            {activeTab === 'general' && (
              <div className="admin-section animate-fade-in">
                <h2>{t('admin.general.title')}</h2>

                <div className="form-group" style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' }}>
                  <label style={{ color: '#0369a1', fontWeight: 700 }}>{t('admin.general.cloudinaryFolder')}</label>
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
                  <label>{t('admin.general.companyName')}</label>
                  <input type="text" className="form-control" value={formData.general.companyName} onChange={(e) => handleChange('general', 'companyName', e.target.value)} />
                </div>

                <div className="form-group">
                  <label>{t('admin.general.logo')}</label>
                  <input type="text" className="form-control" placeholder="URL de la imagen (Opcional)" value={formData.general.logoImage || ''} onChange={(e) => handleChange('general', 'logoImage', e.target.value)} />
                  <div className="image-actions-row">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="form-control"
                      style={{ padding: '0.4rem', flex: 1, minWidth: '200px', marginBottom: 0 }}
                      disabled={uploadingField === 'logo'}
                    />
                    <button type="button" className="btn btn-outline" style={{ padding: '0.4rem 1rem' }} onClick={() => openGallery({ section: 'general', field: 'logoImage' })}>
                      🖼️ Elegir de Cloudinary
                    </button>
                    {uploadingField === 'logo' && <small style={{ color: '#0369a1', width: '100%' }}>⏳ Subiendo a Cloudinary...</small>}
                  </div>
                  <small style={{ color: '#64748b' }}>Recomendado: Imagen en formato PNG con fondo transparente.</small>
                  {formData.general.logoImage && (
                    <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: '4px', display: 'inline-block' }}>
                      <img src={formData.general.logoImage} alt="Logo Preview" style={{ maxHeight: '60px', objectFit: 'contain' }} />
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>{t('admin.general.brandIcon')}</label>
                  <input type="text" className="form-control" value={formData.general.brandIcon || ''} onChange={(e) => handleChange('general', 'brandIcon', e.target.value)} />
                  <div className="image-actions-row">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSingleImageUpload('general', 'brandIcon', e)}
                      className="form-control"
                      style={{ padding: '0.4rem', flex: 1, minWidth: '200px', marginBottom: 0 }}
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
                  <label>{t('admin.general.secondaryLogo')}</label>
                  <input type="text" className="form-control" value={formData.general.secondaryLogo || ''} onChange={(e) => handleChange('general', 'secondaryLogo', e.target.value)} />
                  <div className="image-actions-row">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSingleImageUpload('general', 'secondaryLogo', e)}
                      className="form-control"
                      style={{ padding: '0.4rem', flex: 1, minWidth: '200px', marginBottom: 0 }}
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

                <h2 className="mt-4">{t('admin.contact.mainTitle')}</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label>{t('admin.contact.whatsapp')}</label>
                    <input type="text" className="form-control" value={formData.contact.whatsappNumber || ''} onChange={(e) => handleChange('contact', 'whatsappNumber', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>
                      {t('admin.contact.label')} 
                      <small style={{ color: 'var(--color-primary)', marginLeft: '8px' }}>
                        ({t('contact.whatsappLabelDefault')})
                      </small>
                    </label>
                    <input type="text" className="form-control" value={formData.contact.whatsappLabel || ''} onChange={(e) => handleChange('contact', 'whatsappLabel', e.target.value)} />
                    <small style={{ color: '#64748b' }}>Tip: Dejar vacío para usar la traducción automática del sistema.</small>
                  </div>
                </div>
                <div className="form-group">
                  <label>{t('admin.contact.message')}</label>
                  <textarea className="form-control" rows="2" value={formData.contact.whatsappMessage || ''} onChange={(e) => handleChange('contact', 'whatsappMessage', e.target.value)} placeholder="Ej: Hola! Me interesa saber más sobre sus servicios..."></textarea>
                </div>
                <div className="form-group">
                  <label>{t('admin.contact.phone')}</label>
                  <input type="text" className="form-control" value={formData.contact.phoneDisplay || ''} onChange={(e) => handleChange('contact', 'phoneDisplay', e.target.value)} />
                </div>

                <h2 className="mt-4">{t('admin.contact.secondaryTitle')}</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label>{t('admin.contact.whatsapp')} 2</label>
                    <input type="text" className="form-control" value={formData.contact.secondaryWhatsappNumber || ''} onChange={(e) => handleChange('contact', 'secondaryWhatsappNumber', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>
                      {t('admin.contact.label')} 2
                      <small style={{ color: 'var(--color-primary)', marginLeft: '8px' }}>
                        ({t('contact.secondaryWhatsappLabelDefault')})
                      </small>
                    </label>
                    <input type="text" className="form-control" value={formData.contact.secondaryWhatsappLabel || ''} onChange={(e) => handleChange('contact', 'secondaryWhatsappLabel', e.target.value)} />
                    <small style={{ color: '#64748b' }}>Tip: Dejar vacío para usar la traducción automática del sistema.</small>
                  </div>
                </div>
                <div className="form-group">
                  <label>{t('admin.contact.message')} 2</label>
                  <textarea className="form-control" rows="2" value={formData.contact.secondaryWhatsappMessage || ''} onChange={(e) => handleChange('contact', 'secondaryWhatsappMessage', e.target.value)} placeholder="Ej: Hola! Necesito ayuda técnica..."></textarea>
                </div>
                <div className="form-group">
                  <label>{t('admin.contact.phone')} 2</label>
                  <input type="text" className="form-control" value={formData.contact.secondaryPhoneDisplay || ''} onChange={(e) => handleChange('contact', 'secondaryPhoneDisplay', e.target.value)} />
                </div>

                <h2 className="mt-4">Otros Datos</h2>
                <div className="form-group">
                  <label>Correo Electrónico</label>
                  <input type="email" className="form-control" value={formData.contact.email} onChange={(e) => handleChange('contact', 'email', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Dirección</label>
                  <input type="text" className="form-control" value={formData.contact.address} onChange={(e) => handleChange('contact', 'address', e.target.value)} />
                </div>

                <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 500 }}>
                    <input
                      type="checkbox"
                      checked={formData.contact.showWhatsApp !== false}
                      onChange={(e) => handleChange('contact', 'showWhatsApp', e.target.checked)}
                    />
                    {t('admin.contact.enableWA1')}
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 500 }}>
                    <input
                      type="checkbox"
                      checked={formData.contact.showSecondaryWhatsApp === true}
                      onChange={(e) => handleChange('contact', 'showSecondaryWhatsApp', e.target.checked)}
                    />
                    {t('admin.contact.enableWA2')}
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 500 }}>
                    <input
                      type="checkbox"
                      checked={formData.contact.showPhone !== false}
                      onChange={(e) => handleChange('contact', 'showPhone', e.target.checked)}
                    />
                    {t('admin.contact.showPhone1')}
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 500 }}>
                    <input
                      type="checkbox"
                      checked={formData.contact.showSecondaryPhone === true}
                      onChange={(e) => handleChange('contact', 'showSecondaryPhone', e.target.checked)}
                    />
                    {t('admin.contact.showPhone2')}
                  </label>
                </div>
                
                <div className="section-save-container" style={{ marginTop: '2rem' }}>
                  <button type="button" className="btn btn-primary" onClick={() => handleSaveSection('general')} disabled={isSaving}>
                    {isSaving ? t('admin.actions.saving') : t('admin.actions.save') + ' General & Contacto'}
                  </button>
                </div>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <div className="admin-section animate-fade-in">
                <h2>Configuración de Seguridad</h2>
                <p style={{ color: '#64748b', marginBottom: '2rem' }}>Desde aquí puedes cambiar tu contraseña de acceso y configurar la pregunta de recuperación.</p>

                <div className="admin-item-card" style={{ padding: '2rem' }}>
                  <div className="form-group">
                    <label>Nueva Contraseña</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      value={securityData.newPassword} 
                      onChange={e => setSecurityData({...securityData, newPassword: e.target.value})} 
                      placeholder="Dejar vacío para no cambiar"
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirmar Nueva Contraseña</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      value={securityData.confirmPassword} 
                      onChange={e => setSecurityData({...securityData, confirmPassword: e.target.value})} 
                    />
                  </div>

                  <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />

                  <div className="form-group">
                    <label>Pregunta de Seguridad (Para recuperar acceso)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={securityData.securityQuestion} 
                      onChange={e => setSecurityData({...securityData, securityQuestion: e.target.value})} 
                      placeholder="Ej: ¿Cuál es el nombre de tu primera mascota?"
                    />
                  </div>
                  <div className="form-group">
                    <label>Respuesta de Seguridad</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      value={securityData.securityAnswer} 
                      onChange={e => setSecurityData({...securityData, securityAnswer: e.target.value})} 
                      placeholder="Escribe tu respuesta secreta"
                    />
                    <small style={{ color: '#64748b' }}>La respuesta no distingue mayúsculas/minúsculas al recuperarla.</small>
                  </div>

                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    onClick={handleUpdateSecurity}
                    disabled={isSaving}
                    style={{ marginTop: '1rem', width: '100%', padding: '1rem' }}
                  >
                    {isSaving ? '⏳ Guardando cambios...' : '🔒 Guardar Configuración de Seguridad'}
                  </button>
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
                  <div className="image-actions-row">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSingleImageUpload('hero', 'backgroundImage', e)}
                      className="form-control"
                      style={{ padding: '0.4rem', flex: 1, minWidth: '200px', marginBottom: 0 }}
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

                <div className="section-save-container">
                  <button type="button" className="btn btn-primary" onClick={() => handleSaveSection('hero')} disabled={isSaving}>
                    {isSaving ? 'Guardando...' : '💾 Guardar Sección Hero'}
                  </button>
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
                  <div className="image-actions-row">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSingleImageUpload('about', 'image', e)}
                      className="form-control"
                      style={{ padding: '0.4rem', flex: 1, minWidth: '200px', marginBottom: 0 }}
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

                <div className="section-save-container">
                  <button type="button" className="btn btn-primary" onClick={() => handleSaveSection('about')} disabled={isSaving}>
                    {isSaving ? 'Guardando...' : '💾 Guardar Quiénes Somos'}
                  </button>
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
                        <div className="image-actions-row">
                          <input
                            type="file"
                            accept="image/*"
                            className="form-control"
                            style={{ padding: '0.4rem', flex: 1, minWidth: '200px', marginBottom: 0 }}
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

                <button
                  type="button"
                  className="btn btn-add-item"
                  onClick={() => handleAddArrayItem('trade', 'products', { name: 'Nuevo Producto', description: '', image: '' })}
                >
                  ＋ Agregar Producto
                </button>

                <div className="section-save-container" style={{ marginTop: '2rem' }}>
                  <button type="button" className="btn btn-primary" onClick={() => handleSaveSection('trade')} disabled={isSaving}>
                    {isSaving ? 'Guardando...' : '💾 Guardar Área Comercial'}
                  </button>
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
                        <div className="image-actions-row">
                          <input
                            type="file"
                            accept="image/*"
                            className="form-control"
                            style={{ padding: '0.4rem', flex: 1, minWidth: '200px', marginBottom: 0 }}
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

                <div className="section-save-container" style={{ marginTop: '2rem' }}>
                  <button type="button" className="btn btn-primary" onClick={() => handleSaveSection('financial')} disabled={isSaving}>
                    {isSaving ? 'Guardando...' : '💾 Guardar Área Financiera'}
                  </button>
                </div>
              </div>
            )}

            {/* ALLIES TAB */}
            {activeTab === 'allies' && (
              <div className="admin-section animate-fade-in">
                <h2>Aliados Estratégicos</h2>
                <div className="form-group">
                  <label>Título Principal</label>
                  <input type="text" className="form-control" value={formData.allies.title || ''} onChange={(e) => handleChange('allies', 'title', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Descripción General</label>
                  <textarea className="form-control" rows="2" value={formData.allies.description || ''} onChange={(e) => handleChange('allies', 'description', e.target.value)}></textarea>
                </div>

                <div className="products-admin-list">
                  {formData.allies.items.map((ally, index) => (
                    <div key={ally.id || index} className={`admin-item-card ${ally.visible === false ? 'admin-item-hidden' : ''}`}>
                      <div className="admin-item-header">
                        <h3>Aliado {index + 1}{ally.visible === false && <span className="badge-hidden">Oculto</span>}</h3>
                        <div className="admin-item-actions">
                          <button type="button" title="Subir" className="btn-icon" onClick={() => handleMoveArrayItem('allies', 'items', index, 'up')} disabled={index === 0}>▲</button>
                          <button type="button" title="Bajar" className="btn-icon" onClick={() => handleMoveArrayItem('allies', 'items', index, 'down')} disabled={index === formData.allies.items.length - 1}>▼</button>
                          <button type="button" title={ally.visible === false ? 'Mostrar en el sitio' : 'Ocultar del sitio'} className={`btn-icon ${ally.visible === false ? 'btn-icon-warning' : 'btn-icon-muted'}`} onClick={() => handleToggleVisibility('allies', 'items', index)}>
                            {ally.visible === false ? '👁️' : '🙈'}
                          </button>
                          <button type="button" title="Eliminar aliado" className="btn-icon btn-icon-danger" onClick={() => handleRemoveArrayItem('allies', 'items', index)}>🗑️</button>
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Nombre del Aliado</label>
                        <input type="text" className="form-control" value={ally.name || ''} onChange={(e) => handleArrayChange('allies', 'items', index, 'name', e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Imagen del Aliado</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="URL de imagen (opcional)"
                          value={ally.image || ''}
                          onChange={(e) => handleArrayChange('allies', 'items', index, 'image', e.target.value)}
                        />
                        <div className="image-actions-row">
                          <input
                            type="file"
                            accept="image/*"
                            className="form-control"
                            style={{ padding: '0.4rem', flex: 1, minWidth: '200px', marginBottom: 0 }}
                            onChange={(e) => handleArrayImageUpload('allies', 'items', index, 'image', e)}
                            disabled={uploadingField === `allies-items-${index}`}
                          />
                          <button type="button" className="btn btn-outline" style={{ padding: '0.4rem 1rem' }} onClick={() => openGallery({ section: 'allies', arrayKey: 'items', index, field: 'image' })}>
                            🖼️ Elegir de Cloudinary
                          </button>
                          {uploadingField === `allies-items-${index}` && <small style={{ color: '#0369a1', width: '100%' }}>⏳ Subiendo a Cloudinary...</small>}
                        </div>
                        {ally.image && (
                          <div style={{ marginTop: '0.75rem' }}>
                            <img src={ally.image} alt={ally.name} style={{ height: '80px', borderRadius: '6px', objectFit: 'cover' }} />
                          </div>
                        )}
                      </div>
                      <div className="form-group">
                        <label>
                          Descripción del Aliado (opcional)
                          <span style={{ display: 'block', fontSize: '0.85rem', color: '#666', fontWeight: 'normal', marginTop: '4px' }}>
                            💡 <strong>Formato:</strong> Inicia una línea con un guion <code>- </code> para crear una lista. Usa <code>**texto**</code> para hacer <strong>negrita</strong>.
                          </span>
                        </label>
                        <textarea className="form-control" rows="8" value={ally.description || ''} onChange={(e) => handleArrayChange('allies', 'items', index, 'description', e.target.value)} placeholder="Ejemplo:&#10;- Primer punto de la lista&#10;- Segundo punto&#10;Este aliado es **muy importante**..."></textarea>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="btn btn-add-item"
                  onClick={() => handleAddArrayItem('allies', 'items', { name: 'Nuevo Aliado', description: '', image: '' })}
                >
                  ＋ Agregar Aliado
                </button>

                <div className="section-save-container" style={{ marginTop: '2rem' }}>
                  <button type="button" className="btn btn-primary" onClick={() => handleSaveSection('allies')} disabled={isSaving}>
                    {isSaving ? 'Guardando...' : '💾 Guardar Aliados'}
                  </button>
                </div>
              </div>
            )}

            {/* Ya no hay botón global aquí */}
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
