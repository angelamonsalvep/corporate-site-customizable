import { useEffect } from 'react';
import { useContent } from '../context/ContentContext';

/**
 * SEOHead - Updates the document <head> dynamically with SEO meta-tags.
 * Supports: title, description, keywords, Open Graph, Twitter Cards, Schema.org JSON-LD.
 */
const SEOHead = () => {
  const { content } = useContent();

  useEffect(() => {
    if (!content) return;

    const company = content.general?.companyName || 'Corporate Site';
    const seo = content.seo || {};

    // --- Helpers ---
    const setMeta = (name, value, attr = 'name') => {
      if (!value) return;
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };

    const setLink = (rel, href) => {
      if (!href) return;
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    const setJsonLd = (data) => {
      const id = 'schema-org-jsonld';
      let el = document.getElementById(id);
      if (!el) {
        el = document.createElement('script');
        el.id = id;
        el.type = 'application/ld+json';
        document.head.appendChild(el);
      }
      el.textContent = JSON.stringify(data, null, 2);
    };

    // --- Derived values ---
    const metaTitle = seo.metaTitle || company;
    const metaDescription = seo.metaDescription || `${company} — Official Website`;
    const ogImage = seo.ogImage || content.general?.logoImage || '';
    const siteUrl = seo.siteUrl || window.location.origin;
    const canonicalUrl = siteUrl.replace(/\/$/, '');

    // --- 1. Title ---
    document.title = metaTitle;

    // --- 2. Basic meta-tags ---
    setMeta('description', metaDescription);
    if (seo.metaKeywords) setMeta('keywords', seo.metaKeywords);
    setMeta('robots', 'index, follow');
    setMeta('author', company);

    // --- 3. Google Site Verification ---
    if (seo.googleSiteVerification) {
      setMeta('google-site-verification', seo.googleSiteVerification);
    }

    // --- 4. Canonical URL ---
    setLink('canonical', canonicalUrl);

    // --- 5. Open Graph (Facebook, WhatsApp, LinkedIn) ---
    setMeta('og:type', 'website', 'property');
    setMeta('og:title', metaTitle, 'property');
    setMeta('og:description', metaDescription, 'property');
    setMeta('og:url', canonicalUrl, 'property');
    setMeta('og:site_name', company, 'property');
    if (ogImage) setMeta('og:image', ogImage, 'property');

    // --- 6. Twitter Card ---
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', metaTitle);
    setMeta('twitter:description', metaDescription);
    if (ogImage) setMeta('twitter:image', ogImage);

    // --- 7. Schema.org JSON-LD (Organization) ---
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: company,
      url: canonicalUrl,
      ...(ogImage && { logo: ogImage }),
      ...(content.contact?.email && { email: content.contact.email }),
      ...(content.contact?.phoneDisplay && { telephone: content.contact.phoneDisplay }),
      ...(content.contact?.address && {
        address: {
          '@type': 'PostalAddress',
          streetAddress: content.contact.address
        }
      }),
      ...(content.contact?.whatsappNumber && {
        contactPoint: [{
          '@type': 'ContactPoint',
          telephone: `+${content.contact.whatsappNumber}`,
          contactType: 'customer service',
          availableLanguage: ['English', 'Spanish']
        }]
      }),
      sameAs: [] // Aquí se pueden agregar redes sociales en el futuro
    };

    setJsonLd(schema);

  }, [content]);

  return null; // No renderiza nada en el DOM visible
};

export default SEOHead;
