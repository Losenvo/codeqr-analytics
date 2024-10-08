import type { AllowedPropertyValues } from './types';

export const CLICK_ID_COOKIE_NAME = 'cclid';
export const AFFILIATE_PARAM_KEY = 'via';
export const AFFILIATE_COOKIE_NAME = 'caff';

export function getScriptSrc(): string {
  return (
    process.env.NEXT_PUBLIC_CODEQR_ANALYTICS_SCRIPT_SRC ||
    process.env.CODEQR_ANALYTICS_SCRIPT_SRC ||
    'https://codeqr-analytics.pages.dev/analytics/script.js'
  );
}

export function getTrackEndpoint(): string {
  return (
    process.env.NEXT_PUBLIC_CODEQR_ANALYTICS_TRACK_ENDPOINT ||
    process.env.CODEQR_ANALYTICS_TRACK_ENDPOINT ||
    'https://api.codeqr.io/track'
  );
}

export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function detectEnvironment(): 'development' | 'production' {
  try {
    const env = process.env.NODE_ENV;
    if (env === 'development' || env === 'test') {
      return 'development';
    }
  } catch (e) {
    // do nothing, this is okay
  }
  return 'production';
}

export function isProduction(): boolean {
  return detectEnvironment() === 'production';
}

export function isDevelopment(): boolean {
  return detectEnvironment() === 'development';
}

function removeKey(
  key: string,
  { [key]: _, ...rest },
): Record<string, unknown> {
  return rest;
}

export function parseProperties(
  properties: Record<string, unknown> | undefined,
  options: {
    strip?: boolean;
  },
): Record<string, AllowedPropertyValues> | undefined {
  if (!properties) return undefined;
  let props = properties;
  const errorProperties: string[] = [];
  for (const [key, value] of Object.entries(properties)) {
    if (typeof value === 'object' && value !== null) {
      if (options.strip) {
        props = removeKey(key, props);
      } else {
        errorProperties.push(key);
      }
    }
  }

  if (errorProperties.length > 0 && !options.strip) {
    throw Error(
      `The following properties are not valid: ${errorProperties.join(
        ', ',
      )}. Only strings, numbers, booleans, and null are allowed.`,
    );
  }
  return props as Record<string, AllowedPropertyValues>;
}

export function getClickId(request: Request): string | undefined {
  const cookies = request.headers.get('cookie');
  const clickId = cookies
    ?.split(';')
    .find((c) => c.trim().startsWith(CLICK_ID_COOKIE_NAME))
    ?.split('=')[1];

  return clickId;
}

export function getAffiliateUsername(request: Request): string | undefined {
  const cookies = request.headers.get('cookie');
  const clickId = cookies
    ?.split(';')
    .find((c) => c.trim().startsWith(AFFILIATE_COOKIE_NAME))
    ?.split('=')[1];

  return clickId;
}
