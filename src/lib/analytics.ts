type AnalyticsWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; [key: `ga-disable-${string}`]: boolean | undefined };
const HOSTS = new Set(['royalwellnessspaphuket.com', 'www.royalwellnessspaphuket.com']);

export function isPublicSpaPath(path: string) {
  // The default English locale is unprefixed; Thai uses /th.
  const publicPath = path.replace(/^\/(en|th)(?=\/|$)/, '') || '/';
  return /^(\/|\/(about|contact|book)\/?|\/(treatments|blog)(\/[a-z0-9-]+)?\/?)$/.test(publicPath);
}
export function safeReferrer(referrer: string) {
  try { const url = new URL(referrer); return /^https?:$/.test(url.protocol) ? url.origin + (HOSTS.has(url.hostname) && isPublicSpaPath(url.pathname) ? url.pathname : '/') : ''; }
  catch { return ''; }
}

// Only explicit public-page events. Enhanced measurement is disabled in GA4.
export function createSpaTracker(win: Window, doc: Document, id: string) {
  const browser = win as AnalyticsWindow;
  let initialized = false;
  let lastPath = '';
  const adsDenied = { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' };
  const disable = () => {
    browser[`ga-disable-${id}`] = true;
    if (initialized) browser.gtag?.('consent', 'update', { ...adsDenied, analytics_storage: 'denied' });
  };
  const track = (path: string, consent: boolean) => {
    if (!consent || !/^G-[A-Z0-9]+$/.test(id) || !HOSTS.has(win.location.hostname) || !isPublicSpaPath(path)) { disable(); return; }
    const page = {
      page_location: win.location.origin + path,
      page_referrer: lastPath ? win.location.origin + lastPath : safeReferrer(doc.referrer),
      page_title: `Royal Wellness Spa · ${path.replace(/^\/(en|th)(?=\/|$)/, '').split('/')[1] || 'Home'}`,
    };
    browser[`ga-disable-${id}`] = false;
    if (!initialized) {
      browser.dataLayer = browser.dataLayer || [];
      // Preserve Google's documented Arguments-based command queue format.
      // eslint-disable-next-line prefer-rest-params
      browser.gtag = function () { browser.dataLayer!.push(arguments); };
      browser.gtag('consent', 'default', { ...adsDenied, analytics_storage: 'denied' });
      browser.gtag('js', new Date());
      browser.gtag('consent', 'update', { ...adsDenied, analytics_storage: 'granted' });
      browser.gtag('set', page);
      browser.gtag('config', id, { ...page, send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false });
      const script = doc.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
      script.id = 'spa-google-analytics';
      doc.head.appendChild(script);
      initialized = true;
    } else {
      browser.gtag?.('consent', 'update', { ...adsDenied, analytics_storage: 'granted' });
      browser.gtag?.('set', page);
    }
    if (lastPath === path) return;
    lastPath = path;
    browser.gtag?.('event', 'page_view', { ...page, send_to: id });
  };
  return { track, disable };
}
