import { useContent } from '../context/ContentContext';
import './FloatingContact.css';

const FloatingContact = () => {
  const { content: siteContent } = useContent();
  if (!siteContent) return null;
  return (
    <div className="floating-contact">
      <a 
        href={`https://wa.me/${siteContent.contact.whatsappNumber}`} 
        className="floating-btn whatsapp"
        target="_blank" 
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.01 2.01C6.5 2.01 2 6.51 2 12.02C2 13.78 2.46 15.43 3.26 16.89L2.01 22L7.24 20.78C8.66 21.54 10.29 22.01 12.01 22.01C17.52 22.01 22.02 17.51 22.02 12.01C22.02 6.5 17.52 2.01 12.01 2.01ZM16.89 15.68C16.66 16.32 15.75 16.87 15.1 16.99C14.54 17.09 13.74 17.15 11.23 16.11C8.26 14.88 6.36 11.83 6.2 11.62C6.05 11.41 4.96 9.96 4.96 8.46C4.96 6.96 5.72 6.23 6.02 5.91C6.26 5.66 6.64 5.56 7.01 5.56C7.13 5.56 7.24 5.57 7.34 5.57C7.62 5.58 7.76 5.6 7.95 6.06C8.19 6.64 8.78 8.08 8.85 8.23C8.92 8.38 9 8.57 8.9 8.76C8.8 8.95 8.72 9.07 8.57 9.24C8.42 9.42 8.25 9.55 8.12 9.71C7.96 9.88 7.8 10.06 7.98 10.37C8.16 10.68 8.77 11.68 9.68 12.49C10.85 13.53 11.8 13.86 12.13 14C12.46 14.14 12.66 14.12 12.86 13.91C13.06 13.7 13.65 13.01 13.86 12.72C14.07 12.43 14.28 12.47 14.58 12.58C14.88 12.69 16.48 13.48 16.79 13.64C17.1 13.8 17.31 13.87 17.38 13.99C17.46 14.11 17.46 14.68 17.23 15.32L16.89 15.68Z"/>
        </svg>
      </a>
      
      <a 
        href="#contact" 
        className="floating-btn email"
        aria-label="Ir al formulario de contacto"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </a>
    </div>
  );
};

export default FloatingContact;
