import { useContent } from '../context/ContentContext';
import './About.css';

const About = () => {
  const { content: siteContent, t, translate, translateArray } = useContent();
  if (!siteContent) return null;

  // Resolve paragraphs from DB or static
  const pList = translateArray(siteContent.about, 'description', null);
  const p1 = pList[0] || t('about.p1');
  const p2 = pList[1] || t('about.p2');

  return (
    <section className="section about" id="about">
      <div className="container">
        <div className="about-grid">
          {/* Left: Text content */}
          <div className="about-content">
            <span className="about-eyebrow">{t('about.eyebrow')}</span>
            <div className="about-title-wrapper">
              {siteContent.general.logoImage && (
                <img src={siteContent.general.logoImage} alt="" className="about-title-logo" />
              )}
              <h2 className="section-title-left">{translate(siteContent.about, 'title', 'about.title')}</h2>
            </div>
            <div className="about-text">
              <p>{p1}</p>
              <p>{p2}</p>
            </div>

            <div className="about-highlights">
              <a href="#allies" className="highlight-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                <span className="highlight-icon">🤝</span>
                <div>
                  <strong>{t('about.h1')}</strong>
                  <span>{t('about.h1d')}</span>
                </div>
              </a>
              <div className="highlight-item">
                <span className="highlight-icon">🔒</span>
                <div>
                  <strong>{t('about.h2')}</strong>
                  <span>{t('about.h2d')}</span>
                </div>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">📈</span>
                <div>
                  <strong>{t('about.h3')}</strong>
                  <span>{t('about.h3d')}</span>
                </div>
              </div>
            </div>

            <div className="about-stats">
              <div className="stat-item">
                <h3>10+</h3>
                <p>{t('about.s1')}</p>
              </div>
              <div className="stat-item">
                <h3>Global</h3>
                <p>{t('about.s2')}</p>
              </div>
              <div className="stat-item">
                <h3>100%</h3>
                <p>{t('about.s3')}</p>
              </div>
            </div>
          </div>

          {/* Right: Image */}
          <div className="about-image-wrapper">
            <div className="about-image">
              <img src={siteContent.about.image} alt={siteContent.about.title} />
              <div className="experience-badge">
                <span className="years">{t('about.b1')}</span>
                <span className="text">{t('about.b2')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

