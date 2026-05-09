import { useEffect } from 'react';
import { useContent } from '../context/ContentContext';

/**
 * SEOHead - Updates the document <head> dynamically with SEO meta-tags.
 * Language-aware: meta-tags reflect the active language with English as default.
 * Supports: title, description, keywords, Open Graph, Twitter Cards, hreflang, Schema.org JSON-LD.
 */
const SEOHead = () => {
  const { content, language } = useContent();

  useEffect(() => {
    if (!content) return;

    const company = content.general?.companyName || 'Corporate Site';
    const seo = content.seo || {};
    const lang = language || 'en';

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

    const setLink = (rel, href, extraAttrs = {}) => {
      if (!href) return;
      const selector = extraAttrs.hreflang
        ? `link[rel="alternate"][hreflang="${extraAttrs.hreflang}"]`
        : `link[rel="${rel}"]`;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        Object.entries(extraAttrs).forEach(([k, v]) => el.setAttribute(k, v));
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

    // --- Resolve title & description per active language ---
    // Priority: translations[lang] → translations['en'] → base field → fallback
    const resolveTranslated = (baseField, translationsField) => {
      const translations = seo[translationsField] || {};
      return translations[lang] || translations['en'] || seo[baseField] || null;
    };

    const metaTitle = resolveTranslated('metaTitle', 'metaTitle_translations') || company;
    const metaDescription = resolveTranslated('metaDescription', 'metaDescription_translations')
      || `${company} — Official Website`;
    const ogImage = seo.ogImage || content.general?.logoImage || '';
    const siteUrl = (seo.siteUrl || window.location.origin).replace(/\/$/, '');
    const canonicalUrl = siteUrl;

    // --- 1. HTML lang attribute ---
    document.documentElement.setAttribute('lang', lang);

    // --- 2. Title ---
    document.title = metaTitle;

    // --- 3. Basic meta-tags ---
    setMeta('description', metaDescription);
    if (seo.metaKeywords) setMeta('keywords', seo.metaKeywords);
    setMeta('robots', 'index, follow');
    setMeta('author', company);

    // --- 4. Google Site Verification ---
    if (seo.googleSiteVerification) {
      setMeta('google-site-verification', seo.googleSiteVerification);
    }

    // --- 5. Canonical URL ---
    setLink('canonical', canonicalUrl);

    // --- 6. hreflang — tells Google the languages this site supports ---
    const supportedLangs = ['en', 'es', 'pt', 'fr', 'zh'];
    supportedLangs.forEach(l => {
      setLink('alternate', canonicalUrl, { hreflang: l });
    });
    setLink('alternate', canonicalUrl, { hreflang: 'x-default' });

    // --- 7. Open Graph (Facebook, WhatsApp, LinkedIn) ---
    setMeta('og:type', 'website', 'property');
    setMeta('og:title', metaTitle, 'property');
    setMeta('og:description', metaDescription, 'property');
    setMeta('og:url', canonicalUrl, 'property');
    setMeta('og:site_name', company, 'property');
    setMeta('og:locale', lang, 'property');
    if (ogImage) setMeta('og:image', ogImage, 'property');

    // --- 8. Twitter Card ---
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', metaTitle);
    setMeta('twitter:description', metaDescription);
    if (ogImage) setMeta('twitter:image', ogImage);

    // --- 9. Schema.org JSON-LD (Organization) ---
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
          availableLanguage: ['English', 'Spanish', 'Portuguese', 'French', 'Chinese']
        }]
      }),
      sameAs: []
    };

    setJsonLd(schema);

  }, [content, language]); // Re-runs when language changes

  return null;
};

export default SEOHead;
