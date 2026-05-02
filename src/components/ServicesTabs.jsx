import { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import './ServicesTabs.css';

const ServicesTabs = () => {
  const { content: siteContent, activeService, setActiveService } = useContent();
  const [activeTab, setActiveTab] = useState('trade'); // 'trade' or 'financial'
  const [selectedService, setSelectedService] = useState(null);

  // Escuchar cambios desde el Hero
  useEffect(() => {
    if (activeService) {
      // Cambiar a la pestaña correcta
      setActiveTab(activeService.type);
      
      // Si es financiero, abrir el modal
      if (activeService.type === 'financial') {
        const service = siteContent.financial.services.find(s => s.id === activeService.id);
        if (service) setSelectedService(service);
      }
      
      // Limpiar el estado global después de usarlo
      setActiveService(null);
    }
  }, [activeService, siteContent, setActiveService]);

  if (!siteContent) return null;

  const handleCloseModal = () => setSelectedService(null);

  return (
    <section className="section section-alt services" id="services">
      <div className="container">
        <div className="section-title">
          <div className="services-title-wrapper">
            {siteContent.general.logoImage && (
              <img src={siteContent.general.logoImage} alt="" className="services-title-logo" />
            )}
            <h2>Nuestras Áreas de Negocio</h2>
          </div>
          <p>Soluciones integrales diseñadas para impulsar su crecimiento a nivel global, tanto en el sector comercial como financiero.</p>
        </div>

        <div className="tabs-container">
          <div className="tabs-header">
            <button 
              className={`tab-btn ${activeTab === 'trade' ? 'active' : ''}`}
              onClick={() => setActiveTab('trade')}
            >
              Área Comercial
            </button>
            <button 
              className={`tab-btn ${activeTab === 'financial' ? 'active' : ''}`}
              onClick={() => setActiveTab('financial')}
            >
              Área Financiera
            </button>
          </div>

          <div className="tabs-content">
            {activeTab === 'trade' && (
              <div className="tab-pane animate-fade-in">
                <div className="tab-intro">
                  <h3>{siteContent.trade.title}</h3>
                  <p>{siteContent.trade.description}</p>
                </div>
                
                <div className="products-grid">
                  {siteContent.trade.products.map(product => (
                    <div className="product-card" key={product.id}>
                      <div className="product-image">
                        <img src={product.image} alt={product.name} />
                      </div>
                      <div className="product-info">
                        <h4>{product.name}</h4>
                        <p>{product.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'financial' && (
              <div className="tab-pane animate-fade-in">
                <div className="tab-intro">
                  <h3>{siteContent.financial.title}</h3>
                  <p>{siteContent.financial.description}</p>
                </div>

                <div className="services-grid">
                  {siteContent.financial.services.filter(s => s.visible !== false).map(service => (
                    <div 
                      className="service-card clickable" 
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                    >
                      {service.image ? (
                        <div className="service-image">
                          <img src={service.image} alt={service.name} />
                        </div>
                      ) : (
                        <div className="service-icon">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      )}
                      <div className="service-info">
                        {siteContent.general.brandIcon && (
                          <img src={siteContent.general.brandIcon} alt="" className="service-card-watermark" />
                        )}
                        <h4>{service.name}</h4>
                        <p>{service.description ? (service.description.length > 100 ? service.description.substring(0, 100) + '...' : service.description) : 'Ver más detalles...'}</p>
                        <span className="read-more">Ver detalles →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Detalles de Servicio */}
      {selectedService && (
        <div className="service-modal-overlay" onClick={handleCloseModal}>
          <div className="service-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>✕</button>
            
            <div className="modal-header">
              {selectedService.image && (
                <div className="modal-image">
                  <img src={selectedService.image} alt={selectedService.name} />
                </div>
              )}
              <h3>{selectedService.name}</h3>
            </div>
            
            <div className="modal-body">
              {selectedService.description && (
                <div className="modal-description">
                  <p>{selectedService.description}</p>
                </div>
              )}
              
              {selectedService.items && selectedService.items.length > 0 && (
                <div className="modal-items">
                  <h4>Incluye:</h4>
                  <ul>
                    {selectedService.items.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ServicesTabs;
