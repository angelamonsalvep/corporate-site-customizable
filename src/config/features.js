/**
 * Feature Flags Configuration
 * This file centralizes the control of premium features based on environment variables.
 */

export const features = {
  // SEO Premium Suite: includes advanced meta-tags, sitemap, robots.txt and SEO Admin Panel
  seoPremium: import.meta.env.VITE_ENABLE_SEO_PREMIUM === 'true',
  
  // You can add more feature flags here as the product grows
  // advancedAnalytics: import.meta.env.VITE_ENABLE_ADVANCED_ANALYTICS === 'true',
};

export default features;
