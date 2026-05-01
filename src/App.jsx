import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import ServicesTabs from './components/ServicesTabs';
import Contact from './components/Contact';
import FloatingContact from './components/FloatingContact';
import AdminPanel from './components/AdminPanel';
import { ContentProvider, useContent } from './context/ContentContext';
import { useEffect } from 'react';

function MainSite() {
  const { content, loading, error } = useContent();

  useEffect(() => {
    if (content?.general?.companyName) {
      document.title = content.general.companyName;
    }
  }, [content]);

  if (loading) return <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Cargando...</div>;
  if (error) return <div style={{color: 'red', padding: '2rem'}}>Error cargando el sitio. Intenta nuevamente.</div>;
  if (!content) return null;

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <ServicesTabs />
        <Contact />
      </main>
      <FloatingContact />
      
      <footer style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '2rem 0', textAlign: 'center' }}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} {content.general.companyName}. Todos los derechos reservados.</p>
        </div>
      </footer>
    </>
  );
}

function App() {
  return (
    <ContentProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainSite />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Router>
    </ContentProvider>
  );
}

export default App;
