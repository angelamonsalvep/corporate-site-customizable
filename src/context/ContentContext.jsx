import { createContext, useState, useEffect, useContext } from 'react';
import { translations } from '../translations/index.js'; // Importación explícita con extensión

const ContentContext = createContext();

export const useContent = () => useContext(ContentContext);

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Inicializar idioma desde localStorage o defecto a 'en' (Inglés por defecto)
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('siteLanguage') || 'en';
  });

  // Guardar idioma cuando cambie
  useEffect(() => {
    localStorage.setItem('siteLanguage', language);
  }, [language]);

  // Función de traducción ultra-segura
  const t = (path) => {
    try {
      if (!translations || !language || !translations[language]) {
        return path;
      }
      
      const keys = path.split('.');
      let result = translations[language];
      
      for (const key of keys) {
        if (result && result[key]) {
          result = result[key];
        } else {
          return path;
        }
      }
      return result;
    } catch (e) {
      console.warn("Translation error for path:", path, e);
      return path;
    }
  };

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/content');
      if (!response.ok) throw new Error('Failed to fetch content');
      const data = await response.json();
      setContent(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching content:', err);
      setError(err.message);
      
      // Fallback to local config if server is down (for development robustness)
      import('../config/content').then(module => {
        setContent(module.siteContent);
      }).catch(e => console.error("Could not load fallback content", e));
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (newContent) => {
    try {
      const password = sessionStorage.getItem('adminPassword');
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`
        },
        body: JSON.stringify(newContent)
      });
      if (!response.ok) {
        if (response.status === 401) throw new Error('Contraseña incorrecta o sesión expirada');
        throw new Error('Failed to update content');
      }
      setContent(newContent);
      return { success: true };
    } catch (err) {
      console.error('Error updating content:', err);
      return { success: false, error: err.message };
    }
  };

  const updateContentSection = async (section, sectionData) => {
    try {
      const password = sessionStorage.getItem('adminPassword');
      const response = await fetch(`/api/content/${section}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${password}`
        },
        body: JSON.stringify(sectionData)
      });
      
      if (!response.ok) {
        if (response.status === 401) throw new Error('Contraseña incorrecta o sesión expirada');
        throw new Error('Failed to update section');
      }
      
      // Actualizar el estado local fusionando el cambio
      setContent(prev => ({
        ...prev,
        [section]: sectionData
      }));
      
      return { success: true };
    } catch (err) {
      console.error(`Error updating section ${section}:`, err);
      return { success: false, error: err.message };
    }
  };

  const [activeService, setActiveService] = useState(null);

  useEffect(() => {
    fetchContent();
  }, []);

  return (
    <ContentContext.Provider value={{ 
      content, 
      loading, 
      error, 
      updateContent, 
      updateContentSection,
      fetchContent,
      activeService,
      setActiveService,
      language,
      setLanguage,
      t
    }}>
      {children}
    </ContentContext.Provider>
  );
};
