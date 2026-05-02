import { useState, useEffect, useMemo } from 'react';
import { useContent } from '../context/ContentContext';
import './Hero.css';

const Hero = () => {
  const { content: siteContent, setActiveService, t } = useContent();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Construir las diapositivas dinámicamente basadas en servicios
  const slides = useMemo(() => {
    if (!siteContent) return [];
    
    const serviceSlides = [];
    
    // Funciones de mapeo para traducciones consistentes
    const getProductInfo = (id) => {
      const map = { 'coffee': 'p1', 'sugar': 'p2', 'fuel': 'p3', 'others': 'p4' };
      const key = map[id] || 'p4';
      return { name: t(`trade.${key}_name`), desc: t(`trade.${key}_desc`) };
    };

    const getServiceInfo = (id) => {
      const map = {
        'f1': 's1',
        's1777719342098': 's2',
        's1777719558685': 's3',
        's1777719822396': 's4',
        's1777719994862': 's5',
        's1777720233999': 's6'
      };
      const key = map[id] || 's1';
      return { name: t(`financial.${key}_name`), desc: t(`financial.${key}_desc`) };
    };
    
    // Slide inicial (General)
    serviceSlides.push({
      id: 'home',
      title: t('hero.mainTitle'),
      subtitle: t('hero.mainSubtitle'),
      image: siteContent.hero.backgroundImage,
      type: 'general'
    });

    // Slides de Comercio
    siteContent.trade.products.forEach(p => {
      if (p.image) {
        const info = getProductInfo(p.id);
        serviceSlides.push({
          id: p.id,
          title: info.name,
          subtitle: info.desc,
          image: p.image,
          tag: t('hero.tradeArea'),
          type: 'trade'
        });
      }
    });

    // Slides Financieros
    siteContent.financial.services.forEach(s => {
      if (s.image && s.visible !== false) {
        const info = getServiceInfo(s.id);
        serviceSlides.push({
          id: s.id,
          title: info.name,
          subtitle: info.desc,
          image: s.image,
          tag: t('hero.financialArea'),
          type: 'financial'
        });
      }
    });

    return serviceSlides;
  }, [siteContent, t]);

  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [slides]);

  if (!siteContent || slides.length === 0) return null;

  const currentSlide = slides[currentIndex];

  const handleServiceClick = (e) => {
    if (currentSlide.type !== 'general') {
      setActiveService({ id: currentSlide.id, type: currentSlide.type });
    }
  };

  return (
    <section className="hero" id="home">
      {/* Sistema de capas para fundido suave (cross-fade) */}
      <div className="hero-background-container">
        {slides.map((slide, index) => (
          <div 
            key={slide.id + index}
            className={`hero-background-layer ${index === currentIndex ? 'active' : ''}`}
            style={{ 
              backgroundImage: `url(${slide.image})`,
            }}
          />
        ))}
        {/* El overlay ahora es constante y está encima de todas las capas */}
        <div className="hero-overlay"></div>
      </div>
      
      <div className="container hero-content">
        <div className="hero-text animate-fade-in" key={currentIndex}>
          {currentSlide.tag && <span className="hero-tag">{currentSlide.tag}</span>}
          
          <h1>{currentSlide.title}</h1>
          <p>{currentSlide.subtitle}</p>
          
          <div className="hero-buttons">
            <a href="#services" className="btn btn-primary" onClick={handleServiceClick}>
              {t('hero.viewDetails')}
            </a>
          </div>
        </div>
        
        {/* Indicadores del carrusel */}
        <div className="hero-dots">
          {slides.map((_, index) => (
            <span 
              key={index} 
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
