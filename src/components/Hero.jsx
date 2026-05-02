import { useState, useEffect, useMemo } from 'react';
import { useContent } from '../context/ContentContext';
import './Hero.css';

const Hero = () => {
  const { content: siteContent, setActiveService } = useContent();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Construir las diapositivas dinámicamente basadas en servicios
  const slides = useMemo(() => {
    if (!siteContent) return [];
    
    const serviceSlides = [];
    
    // Slide inicial (General)
    serviceSlides.push({
      id: 'home',
      title: siteContent.hero.title,
      subtitle: siteContent.hero.subtitle,
      image: siteContent.hero.backgroundImage,
      type: 'general'
    });

    // Slides de Comercio
    siteContent.trade.products.forEach(p => {
      if (p.image) {
        serviceSlides.push({
          id: p.id,
          title: p.name,
          subtitle: p.description,
          image: p.image,
          tag: "Área Comercial",
          type: 'trade'
        });
      }
    });

    // Slides Financieros
    siteContent.financial.services.forEach(s => {
      if (s.image && s.visible !== false) {
        serviceSlides.push({
          id: s.id,
          title: s.name,
          subtitle: s.description,
          image: s.image,
          tag: "Área Financiera",
          type: 'financial'
        });
      }
    });

    return serviceSlides;
  }, [siteContent]);

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
              Ver Detalles del Servicio
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
