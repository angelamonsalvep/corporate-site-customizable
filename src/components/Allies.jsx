import { useContent } from '../context/ContentContext';
import './Allies.css';

const Allies = () => {
  const { content, t, language, translate } = useContent();

  if (!content || !content.allies || !content.allies.items || content.allies.items.length === 0) {
    return null; // No mostrar si no hay aliados configurados
  }

  const visibleAllies = content.allies.items.filter(ally => ally.visible !== false);

  if (visibleAllies.length === 0) return null;

  const sectionTitle = translate(content.allies, 'title', 'allies.title');
  const sectionDesc = translate(content.allies, 'description', 'allies.desc');

  return (
    <section className="section allies" id="allies">
      <div className="container">
        <div className="section-title">
          <h2>{sectionTitle}</h2>
          <p>{sectionDesc}</p>
        </div>

        <div className="allies-grid">
          {visibleAllies.map((ally, index) => {
            const allyName = translate(ally, 'name', null);
            const allyDesc = translate(ally, 'description', null);
            
            // Formateador inteligente para descripciones largas
            const formatText = (text) => {
              if (!text) return null;
              const lines = text.split('\n');
              const elements = [];
              let currentList = [];

              const flushList = () => {
                if (currentList.length > 0) {
                  elements.push(<ul key={`ul-${elements.length}`} className="ally-list">{currentList}</ul>);
                  currentList = [];
                }
              };

              const parseInline = (str) => {
                // Parsea **negrita** tolerando espacios extra que pueda agregar el traductor
                const parts = str.split(/(\*\*\s*.*?\s*\*\*)/g);
                return parts.map((part, i) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    // Limpia asteriscos
                    return <strong key={i} style={{ color: '#fff' }}>{part.replace(/\*\*/g, '').trim()}</strong>;
                  }
                  return part;
                });
              };

              lines.forEach((line, index) => {
                const trimmed = line.trim();
                // Si la línea empieza con un guion o asterisco, es una lista
                if (trimmed.startsWith('- ') || trimmed.startsWith('-') || trimmed.startsWith('•')) {
                  const cleanText = trimmed.replace(/^[-•]\s*/, '');
                  currentList.push(<li key={`li-${index}`}>{parseInline(cleanText)}</li>);
                } else {
                  flushList();
                  if (trimmed) {
                    elements.push(<p key={`p-${index}`} className="ally-paragraph">{parseInline(trimmed)}</p>);
                  }
                }
              });
              flushList();
              return elements;
            };

            return (
              <div className="ally-card animate-fade-in" key={ally.id || index} style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="ally-info">
                  <h4>{allyName}</h4>
                  {ally.image && (
                    <img src={ally.image} alt={allyName} className="ally-image-floated" />
                  )}
                  {allyDesc && (
                    <div className="ally-description">
                      {formatText(allyDesc)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Allies;
