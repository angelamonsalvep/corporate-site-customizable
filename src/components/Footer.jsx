import { useContent } from '../context/ContentContext';
import './Footer.css';

const Footer = () => {
  const { content: siteContent, t } = useContent();

  if (!siteContent) return null;

  return (
    <footer className="main-footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <h2 className="footer-logo-text">{siteContent.general.companyName}</h2>
          <p className="footer-tagline">
            {t('footer.tagline')}
          </p>
        </div>

        <div className="footer-links">
          <div className="footer-nav">
            <h4>{t('footer.nav')}</h4>
            <ul>
              <li><a href="#home">{t('nav.home')}</a></li>
              <li><a href="#about">{t('nav.about')}</a></li>
              <li><a href="#services">{t('nav.services')}</a></li>
              <li><a href="#contact">{t('nav.contact')}</a></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4>{t('footer.contact')}</h4>
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
          <p>&copy; {new Date().getFullYear()} {siteContent.general.companyName}. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
