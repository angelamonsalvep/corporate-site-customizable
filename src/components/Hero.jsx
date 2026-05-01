import { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import './Hero.css';

const Hero = () => {
  const { content: siteContent } = useContent();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!siteContent) return;
    
    const tradeImages = siteContent.trade?.products?.map(p => p.image) || [];
    const finImages = siteContent.financial?.services?.map(s => s.image) || [];
    const allImages = [...tradeImages, ...finImages].filter(img => img && img.trim() !== '');
    
    if (allImages.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % allImages.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [siteContent]);

  if (!siteContent) return null;

  const tradeImages = siteContent.trade?.products?.map(p => p.image) || [];
  const finImages = siteContent.financial?.services?.map(s => s.image) || [];
  const allImages = [...tradeImages, ...finImages].filter(img => img && img.trim() !== '');
  
  const currentImage = allImages.length > 0 ? allImages[currentImageIndex] : siteContent.hero.backgroundImage;

  return (
    <section className="hero" id="home">
      <div 
        className="hero-background" 
        style={{ 
          backgroundImage: `url(${currentImage})`,
          transition: 'background-image 1.5s ease-in-out'
        }}
      >
        <div className="hero-overlay"></div>
      </div>
      
      <div className="container hero-content">
        <div className="hero-text animate-fade-in">
          <h1>{siteContent.hero.title}</h1>
          <p>{siteContent.hero.subtitle}</p>
          <div className="hero-buttons">
            <a href="#services" className="btn btn-primary">Conoce Nuestros Servicios</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
