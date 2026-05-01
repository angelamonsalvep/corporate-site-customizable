import { useState } from 'react';
import { useContent } from '../context/ContentContext';
import './ServicesTabs.css';

const ServicesTabs = () => {
  const { content: siteContent } = useContent();
  const [activeTab, setActiveTab] = useState('trade'); // 'trade' or 'financial'

  if (!siteContent) return null;

  return (
    <section className="section section-alt services" id="services">
      <div className="container">
        <div className="section-title">
          <h2>Nuestras Áreas de Negocio</h2>
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
                  {siteContent.financial.services.map(service => (
                    <div className="service-card" key={service.id}>
                      <div className="service-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="service-info">
                        <h4>{service.name}</h4>
                        <p>{service.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesTabs;
