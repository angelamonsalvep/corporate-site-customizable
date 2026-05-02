import { useContent } from '../context/ContentContext';
import './Footer.css';

const Footer = () => {
  const { content: siteContent } = useContent();

  if (!siteContent) return null;

  return (
    <footer className="main-footer">
      <div className="container footer-container">
        <div className="footer-brand">
          {siteContent.general.secondaryLogo || siteContent.general.logoImage ? (
            <img 
              src={siteContent.general.secondaryLogo || siteContent.general.logoImage} 
              alt={siteContent.general.companyName} 
              className="footer-logo" 
            />
          ) : (
            <h2 className="footer-logo-text">{siteContent.general.companyName}</h2>
          )}
          <p className="footer-tagline">
            Liderazgo y excelencia en comercio internacional y soluciones financieras globales.
          </p>
        </div>

        <div className="footer-links">
          <div className="footer-nav">
            <h4>Navegación</h4>
            <ul>
              <li><a href="#home">Inicio</a></li>
              <li><a href="#about">Sobre Nosotros</a></li>
              <li><a href="#services">Servicios</a></li>
              <li><a href="#contact">Contacto</a></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>Contacto</h4>
            <ul>
              <li>{siteContent.contact.address}</li>
              <li>{siteContent.contact.email}</li>
              <li>{siteContent.contact.phoneDisplay}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} {siteContent.general.companyName}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
