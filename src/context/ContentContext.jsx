import { createContext, useState, useEffect, useContext } from 'react';
import { translations as dictSource } from '../translations/index.js';

const ContentContext = createContext();

export const useContent = () => useContext(ContentContext);

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Diccionario garantizado
  const translations = dictSource || {};
  
  // Inicializar idioma con validación reforzada
  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem('siteLanguage');
      if (saved && translations[saved]) return saved;
      return 'en'; // Inglés como idioma universal por defecto
    } catch (e) {
      return 'en';
    }
  });

  // Guardar idioma cuando cambie
  useEffect(() => {
    localStorage.setItem('siteLanguage', language);
  }, [language]);

  // Función de traducción ultra-segura mejorada
  const t = (path) => {
    try {
      const currentLang = language || 'en';
      // Buscar en el idioma actual, o fallback a español, o fallback a inglés
      const dict = translations[currentLang] || translations['es'] || translations['en'];
      
      if (!dict) return path;

      const keys = path.split('.');
      let result = dict;
      
      for (const key of keys) {
        if (result && result[key]) {
          result = result[key];
        } else {
          // Si no encuentra la llave en el idioma actual, intentar en español
          if (currentLang !== 'es' && translations['es']) {
            let fallbackResult = translations['es'];
            for (const fallbackKey of keys) {
              if (fallbackResult && fallbackResult[fallbackKey]) {
                fallbackResult = fallbackResult[fallbackKey];
              } else {
                return path;
              }
            }
            return fallbackResult;
          }
          return path;
        }
      }
      return result;
    } catch (e) {
      console.warn("Translation error for path:", path, e);
      return path;
    }
  };

  // Global translation resolver for DB-driven content
  const translate = (parentObj, field, staticFallbackKey) => {
    if (!parentObj) return t(staticFallbackKey);
    
    const transField = `${field}_translations`;
    if (parentObj[transField] && parentObj[transField][language]) {
      return parentObj[transField][language];
    }
    
    // If language is ES (source) and field exists, use it
    if (language === 'es' && parentObj[field]) {
      return parentObj[field];
    }
    
    // Fallback to static translations
    return staticFallbackKey ? t(staticFallbackKey) : (parentObj[field] || '');
  };

  const translateArray = (parentObj, field, staticFallbackKey) => {
    if (!parentObj) return t(staticFallbackKey) || [];
    
    const transField = `${field}_translations`;
    if (parentObj[transField] && parentObj[transField][language]) {
      return parentObj[transField][language];
    }
    
    if (language === 'es' && parentObj[field]) {
      return parentObj[field];
    }
    
    return staticFallbackKey ? t(staticFallbackKey) : (parentObj[field] || []);
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
      t,
      translate,
      translateArray
    }}>
      {children}
    </ContentContext.Provider>
  );
};
