import { useState } from 'react';
import { useContent } from '../context/ContentContext';
import './Contact.css';

const Contact = () => {
  const { content: siteContent } = useContent();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      // Using FormSubmit.co to send the email directly to the configured email
      const response = await fetch(`https://formsubmit.co/ajax/${siteContent.contact.email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `Nuevo mensaje de ${formData.name} desde la Web Corporativa`,
          Nombre: formData.name,
          Email: formData.email,
          Empresa: formData.company || 'No especificada',
          Mensaje: formData.message
        })
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', company: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error enviando formulario:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section contact" id="contact">
      <div className="container">
        <div className="section-title">
          <h2>Contáctanos</h2>
          <p>Estamos listos para asesorarlo y llevar su negocio al siguiente nivel internacional.</p>
        </div>

        <div className="contact-grid">
          <div 
            className="contact-info" 
            style={{ '--bg-image': `url(${siteContent.general.secondaryLogo})` }}
          >
            <div className="info-card">
              <h3>Información de Contacto</h3>
              <p>Comuníquese con nosotros para recibir atención personalizada de nuestros expertos.</p>
              
              <ul className="info-list">
                <li>
                  <span className="icon">📍</span>
                  <span>{siteContent.contact.address}</span>
                </li>
                {siteContent.contact.showPhone !== false && (
                  <li>
                    <span className="icon">📞</span>
                    <span>{siteContent.contact.phoneDisplay}</span>
                  </li>
                )}
                <li>
                  <span className="icon">✉️</span>
                  <span>{siteContent.contact.email}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="contact-form-wrapper">
            {siteContent.general.secondaryLogo && (
              <img src={siteContent.general.secondaryLogo} alt="" className="contact-brand-watermark" />
            )}
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="name">Nombre Completo</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  className="form-control" 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Correo Electrónico</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    className="form-control" 
                    value={formData.email}
                    onChange={handleChange}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="company">Empresa</label>
                  <input 
                    type="text" 
                    id="company" 
                    name="company" 
                    className="form-control" 
                    value={formData.company}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="message">Mensaje</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows="5" 
                  className="form-control" 
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              {submitStatus === 'success' && (
                <div style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '1rem', borderRadius: '6px', marginBottom: '1.5rem', border: '1px solid #bbf7d0' }}>
                  ¡Mensaje enviado con éxito! Nos contactaremos pronto.
                </div>
              )}
              {submitStatus === 'error' && (
                <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '6px', marginBottom: '1.5rem', border: '1px solid #fecaca' }}>
                  Hubo un error al enviar el mensaje. Por favor intenta de nuevo.
                </div>
              )}

              <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
