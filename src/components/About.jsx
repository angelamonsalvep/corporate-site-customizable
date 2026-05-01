import { useContent } from '../context/ContentContext';
import './About.css';

const About = () => {
  const { content: siteContent } = useContent();
  if (!siteContent) return null;
  return (
    <section className="section about" id="about">
      <div className="container">
        <div className="about-grid">
          {/* Left: Text content */}
          <div className="about-content">
            <span className="about-eyebrow">🌐 Nuestra Historia</span>
            <h2 className="section-title-left">{siteContent.about.title}</h2>
            <div className="about-text">
              {siteContent.about.description.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="about-highlights">
              <div className="highlight-item">
                <span className="highlight-icon">🤝</span>
                <div>
                  <strong>Alianzas Estratégicas</strong>
                  <span>Red de socios comerciales en múltiples continentes</span>
                </div>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">🔒</span>
                <div>
                  <strong>Operaciones Seguras</strong>
                  <span>Procesos auditados y transparentes bajo estándares internacionales</span>
                </div>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">📈</span>
                <div>
                  <strong>Crecimiento Sostenible</strong>
                  <span>Estrategias diseñadas para maximizar el retorno a largo plazo</span>
                </div>
              </div>
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

          {/* Right: Image */}
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

