import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import ServicesTabs from './components/ServicesTabs';
import Contact from './components/Contact';
import FloatingContact from './components/FloatingContact';
import AdminPanel from './components/AdminPanel';
import Allies from './components/Allies';
import Footer from './components/Footer';
import { ContentProvider, useContent } from './context/ContentContext';
import { useEffect } from 'react';

function MainSite() {
  const { content, loading, error } = useContent();

  if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cargando...</div>;
  if (error) return <div style={{ color: 'red', padding: '2rem' }}>Error cargando el sitio. Intenta nuevamente.</div>;
  if (!content) return null;

  return (
    <>
      <FloatingContact />
      <Navbar />
      <main>
        <Hero />
        <About />
        <ServicesTabs />
        <Allies />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

function AppContent() {
  const { content } = useContent();

  useEffect(() => {
    if (content?.general) {
      // Actualizar título globalmente
      const isAdmin = window.location.pathname.includes('/admin');
      if (content.general.companyName) {
        document.title = content.general.companyName + (isAdmin ? ' - Admin' : '');
      }
      
      // Actualizar Favicon dinámicamente en todas las rutas
      const bestIcon = content.general.brandIcon || content.general.logoImage || content.general.secondaryLogo;
      if (bestIcon) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = bestIcon;
      }
    }
  }, [content]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainSite />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ContentProvider>
      <AppContent />
    </ContentProvider>
  );
}

export default App;
