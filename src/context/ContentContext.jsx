import { createContext, useState, useEffect, useContext } from 'react';

const ContentContext = createContext();

export const useContent = () => useContext(ContentContext);

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContent = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/content');
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
      const response = await fetch('http://localhost:3001/api/content', {
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

  useEffect(() => {
    fetchContent();
  }, []);

  return (
    <ContentContext.Provider value={{ content, loading, error, updateContent, fetchContent }}>
      {children}
    </ContentContext.Provider>
  );
};
