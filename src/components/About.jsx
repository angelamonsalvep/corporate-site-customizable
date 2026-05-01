import { useContent } from '../context/ContentContext';
import './About.css';

const About = () => {
  const { content: siteContent } = useContent();
  if (!siteContent) return null;
  return (
    <section className="section about" id="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-content">
            <h2 className="section-title-left">{siteContent.about.title}</h2>
            <div className="about-text">
              {siteContent.about.description.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            
            <div className="about-stats">
              <div className="stat-item">
                <h3>10+</h3>
                <p>Años de Experiencia</p>
              </div>
              <div className="stat-item">
                <h3>Global</h3>
                <p>Presencia Internacional</p>
              </div>
              <div className="stat-item">
                <h3>100%</h3>
                <p>Compromiso</p>
              </div>
            </div>
          </div>
          
          <div className="about-image-wrapper">
            <div className="about-image">
              <img src={siteContent.about.image} alt={siteContent.about.title} />
              <div className="experience-badge">
                <span className="years">Solidez</span>
                <span className="text">Financiera</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
