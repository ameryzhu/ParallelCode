/** @type {import('next').NextConfig} */
const nextConfig = {
  // NOTE: Do NOT use Next.js built-in i18n config together with middleware-based i18n.
  // Locale routing is handled entirely in middleware.ts to ensure /api/* routes
  // are never prefixed with a locale (e.g., /en/api/auth/callback/google).
  //
  // If you previously had i18n config here like:
  //   i18n: { locales: ['en', 'zh'], defaultLocale: 'en' }
  // Remove it — the middleware handles locale detection and redirection.
};

module.exports = nextConfig;
