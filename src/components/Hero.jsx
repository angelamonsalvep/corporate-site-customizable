import { useState, useEffect, useMemo } from 'react';
import { useContent } from '../context/ContentContext';
import './Hero.css';

const Hero = () => {
  const contextValues = useContent();
  const { content: siteContent, setActiveService, t, translate } = contextValues;
  const [currentIndex, setCurrentIndex] = useState(0);

  // Construir las diapositivas dinámicamente basadas en servicios
  const slides = useMemo(() => {
    if (!siteContent) return [];
    
    const { translate, t } = contextValues;
    const serviceSlides = [];
    
    // Slide inicial (General)
    serviceSlides.push({
      id: 'home',
      title: translate(siteContent.hero, 'title', 'hero.mainTitle'),
      subtitle: translate(siteContent.hero, 'subtitle', 'hero.mainSubtitle'),
      image: siteContent.hero.backgroundImage,
      type: 'general'
    });

    // Slides de Comercio
    siteContent.trade.products.forEach(p => {
      if (p.image) {
        // Encontrar la info estática para fallback si es necesario
        const map = { 'coffee': 'p1', 'sugar': 'p2', 'fuel': 'p3', 'others': 'p4' };
        const staticKey = map[p.id] || 'p4';
        
        serviceSlides.push({
          id: p.id,
          title: translate(p, 'name', `trade.${staticKey}_name`),
          subtitle: translate(p, 'description', `trade.${staticKey}_desc`),
          image: p.image,
          tag: t('hero.tradeArea'),
          type: 'trade'
        });
      }
    });

    // Slides Financieros
    siteContent.financial.services.forEach(s => {
      if (s.image && s.visible !== false) {
        const map = {
          'f1': 's1',
          's1777719342098': 's2',
          's1777719558685': 's3',
          's1777719822396': 's4',
          's1777719994862': 's5',
          's1777720233999': 's6'
        };
        const staticKey = map[s.id] || 's1';

        serviceSlides.push({
          id: s.id,
          title: translate(s, 'name', `financial.${staticKey}_name`),
          subtitle: translate(s, 'description', `financial.${staticKey}_desc`),
          image: s.image,
          tag: t('hero.financialArea'),
          type: 'financial'
        });
      }
    });

    return serviceSlides;
  }, [siteContent, contextValues]);

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
