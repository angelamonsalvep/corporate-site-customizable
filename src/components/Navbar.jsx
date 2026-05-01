import { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import './Navbar.css';

const Navbar = () => {
  const { content: siteContent } = useContent();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!siteContent) return null;

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-container">
        <a href="#" className="navbar-logo" style={
          siteContent.general.logoImage ? {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            padding: '8px 16px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          } : {}
        }>
          {siteContent.general.logoImage ? (
            <img src={siteContent.general.logoImage} alt={siteContent.general.companyName} style={{ height: '65px', objectFit: 'contain' }} />
          ) : (
            siteContent.general.companyName
          )}
        </a>

        <div className={`navbar-links ${mobileMenuOpen ? 'active' : ''}`}>
          <a href="#about" onClick={() => setMobileMenuOpen(false)}>Quiénes Somos</a>
          <a href="#services" onClick={() => setMobileMenuOpen(false)}>Servicios</a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contacto</a>
        </div>

        <button 
          className="mobile-menu-btn" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
