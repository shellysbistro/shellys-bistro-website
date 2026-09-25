import { isIP } from 'node:net';

export const buildMode = process.env.SHELLY_BUILD_MODE || 'review';
if (!['review', 'production'].includes(buildMode)) {
  throw new Error('SHELLY_BUILD_MODE must be "review" or "production".');
}

export const isProduction = buildMode === 'production';

const reviewCateringUrl = 'https://shellys-catering-menu-khwoj3xrj-richardtrippy-9144s-projects.vercel.app/?_vercel_share=K57t6jr6PpZm5FTpLVTuJghpBnzVKA4r';

export function requireStableCateringUrl(value) {
  if (!value || value !== value.trim()) {
    throw new Error('Production builds require an explicit SHELLY_CATERING_URL with a stable HTTPS ordering destination.');
  }

  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error('SHELLY_CATERING_URL must be an absolute HTTPS URL.');
  }

  if (url.protocol !== 'https:' || url.username || url.password || url.port || url.search || url.hash) {
    throw new Error('SHELLY_CATERING_URL must be HTTPS, without credentials, a port, query token or fragment.');
  }

  const hostname = url.hostname.toLowerCase();
  if (!hostname.includes('.') || isIP(hostname) || hostname.endsWith('.local') || hostname.endsWith('.internal')) {
    throw new Error('SHELLY_CATERING_URL must use a public, stable hostname.');
  }

  // The only known stable Vercel alias for this catalogue is its production alias.
  // Deployment-specific Vercel URLs, including the shared tester preview, are not launch URLs.
  if (hostname.endsWith('.vercel.app') && hostname !== 'shellys-catering-menu.vercel.app') {
    throw new Error('SHELLY_CATERING_URL cannot use a Vercel preview or tester deployment URL.');
  }

  if (/(^|[.-])(preview|staging|testers?|qa)([.-]|$)/i.test(hostname) ||
      /(?:^|\/)(?:preview|staging|testers?|share|invite|token)(?:\/|$)/i.test(url.pathname)) {
    throw new Error('SHELLY_CATERING_URL cannot use a preview, staging, tester or token-sharing URL.');
  }

  return url.href;
}

export const cateringRequestUrl = isProduction
  ? requireStableCateringUrl(process.env.SHELLY_CATERING_URL)
  : reviewCateringUrl;
