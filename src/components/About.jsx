import { useContent } from '../context/ContentContext';
import './About.css';

const About = () => {
  const { content: siteContent, t, translate, translateArray } = useContent();
  if (!siteContent) return null;

  // Resolve paragraphs from DB or static
  const pList = translateArray(siteContent.about, 'paragraphs', null);
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
                  <strong>{translate(siteContent.about, 'highlight1_title', 'about.h1')}</strong>
                  <span>{translate(siteContent.about, 'highlight1_desc', 'about.h1d')}</span>
                </div>
              </a>
              <div className="highlight-item">
                <span className="highlight-icon">🔒</span>
                <div>
                  <strong>{translate(siteContent.about, 'highlight2_title', 'about.h2')}</strong>
                  <span>{translate(siteContent.about, 'highlight2_desc', 'about.h2d')}</span>
                </div>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">📈</span>
                <div>
                  <strong>{translate(siteContent.about, 'highlight3_title', 'about.h3')}</strong>
                  <span>{translate(siteContent.about, 'highlight3_desc', 'about.h3d')}</span>
                </div>
              </div>
            </div>

            <div className="about-stats">
              <div className="stat-item">
                <h3>{siteContent.about.stat1_value || '10+'}</h3>
                <p>{translate(siteContent.about, 'stat1_label', 'about.s1')}</p>
              </div>
              <div className="stat-item">
                <h3>{siteContent.about.stat2_value || 'Global'}</h3>
                <p>{translate(siteContent.about, 'stat2_label', 'about.s2')}</p>
              </div>
              <div className="stat-item">
                <h3>{siteContent.about.stat3_value || '100%'}</h3>
                <p>{translate(siteContent.about, 'stat3_label', 'about.s3')}</p>
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

