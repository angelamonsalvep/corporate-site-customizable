import { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import './Navbar.css';

const Navbar = () => {
  const { content: siteContent, language, setLanguage, t } = useContent();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const languages = [
    { code: 'es', label: 'ES', flag: '🇪🇸' },
    { code: 'en', label: 'EN', flag: '🇺🇸' },
    { code: 'pt', label: 'PT', flag: '🇧🇷' },
    { code: 'fr', label: 'FR', flag: '🇫🇷' },
    { code: 'zh', label: 'ZH', flag: '🇨🇳' }
  ];

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
            padding: '4px 20px',
            borderRadius: '50px',
            border: '1px solid var(--color-accent)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          } : {}
        }>
          {siteContent.general.logoImage ? (
            <img src={siteContent.general.logoImage} alt={siteContent.general.companyName} style={{ height: '55px', objectFit: 'contain' }} />
          ) : (
            siteContent.general.companyName
          )}
        </a>

        <div className={`navbar-links ${mobileMenuOpen ? 'active' : ''}`}>
          <a href="#" onClick={() => setMobileMenuOpen(false)}>{t('nav.home')}</a>
          <a href="#about" onClick={() => setMobileMenuOpen(false)}>{t('nav.about')}</a>
          <a href="#services" onClick={() => setMobileMenuOpen(false)}>{t('nav.services')}</a>
          <a href="#allies" onClick={() => setMobileMenuOpen(false)}>{t('nav.allies')}</a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)}>{t('nav.contact')}</a>
          
          {/* Selector de Idioma */}
          <div className="lang-selector-wrapper">
            <button 
              className="lang-selector-btn"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
            >
              <span className="lang-flag">{languages.find(l => l.code === language)?.flag}</span>
              <span className="lang-label">{language.toUpperCase()}</span>
              <span className={`lang-arrow ${langMenuOpen ? 'open' : ''}`}>▾</span>
            </button>
            
            {langMenuOpen && (
              <div className="lang-dropdown">
                {languages.map((lang) => (
                  <button 
                    key={lang.code}
                    className={`lang-option ${language === lang.code ? 'active' : ''}`}
                    onClick={() => {
                      setLanguage(lang.code);
                      setLangMenuOpen(false);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <span className="option-flag">{lang.flag}</span>
                    <span className="option-label">{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
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
