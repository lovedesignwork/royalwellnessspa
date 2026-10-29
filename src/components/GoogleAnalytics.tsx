'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { createSpaTracker, isPublicSpaPath } from '@/lib/analytics';

const ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';
const KEY = 'rws_analytics_consent';
const CHANGE = 'rws-analytics-consent';
const OPEN = 'rws-analytics-settings';
type Consent = 'granted' | 'denied' | 'pending' | null;
let memory: Consent = null;
function snapshot(): Consent {
  try { const value = localStorage.getItem(KEY); return value === 'granted' || value === 'denied' ? value : memory; }
  catch { return memory; }
}
const serverSnapshot = (): Consent => 'pending';
function subscribe(callback: () => void) {
  window.addEventListener(CHANGE, callback);
  window.addEventListener('storage', callback);
  return () => { window.removeEventListener(CHANGE, callback); window.removeEventListener('storage', callback); };
}

export function AnalyticsSettingsButton() {
  const thai = useLocale() === 'th';
  if (!/^G-[A-Z0-9]+$/.test(ID)) return null;
  return <button type="button" className="hover:text-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold cursor-pointer" onClick={() => window.dispatchEvent(new Event(OPEN))}>{thai ? 'ตั้งค่าคุกกี้' : 'Cookie settings'}</button>;
}

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const thai = useLocale() === 'th';
  const consent = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const tracker = useRef<ReturnType<typeof createSpaTracker> | null>(null);
  const settingsButton = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const open = () => { settingsButton.current = document.activeElement as HTMLElement; setSettingsOpen(true); };
    window.addEventListener(OPEN, open);
    return () => window.removeEventListener(OPEN, open);
  }, []);
  useEffect(() => {
    tracker.current ??= createSpaTracker(window, document, ID);
    try { tracker.current.track(pathname, consent === 'granted'); } catch { /* Analytics must never interrupt booking. */ }
    return () => tracker.current?.disable();
  }, [pathname, consent]);
  function choose(value: 'granted' | 'denied') {
    // Disable synchronously before saving a withdrawal of consent.
    if (value === 'denied') tracker.current?.disable();
    memory = value;
    try { localStorage.setItem(KEY, value); } catch { /* Keep the choice in memory if storage is unavailable. */ }
    window.dispatchEvent(new Event(CHANGE));
    setSettingsOpen(false);
    settingsButton.current?.focus();
  }
  if (!/^G-[A-Z0-9]+$/.test(ID) || !isPublicSpaPath(pathname) || consent === 'pending' || (consent !== null && !settingsOpen)) return null;
  return <section className="spa-cookie-banner" aria-label={thai ? 'การตั้งค่าคุกกี้วิเคราะห์' : 'Analytics cookie preferences'}>
    <div><h2>{thai ? 'ช่วยให้เราปรับปรุงเว็บไซต์' : 'Help us improve your visit'}</h2><p>{thai ? 'เราใช้ Google Analytics เพื่อทำความเข้าใจการใช้งานเว็บไซต์เมื่อคุณอนุญาต คุณยังจองบริการได้ตามปกติหากปฏิเสธ และเปลี่ยนตัวเลือกได้ที่ “ตั้งค่าคุกกี้” ด้านล่างเว็บไซต์' : 'With your permission, Google Analytics helps us understand how this website is used. You can book without allowing analytics and change your choice in Cookie settings at any time.'}</p></div>
    <div className="spa-cookie-actions"><button type="button" onClick={() => choose('denied')}>{thai ? 'ไม่อนุญาต' : 'Decline analytics'}</button><button type="button" onClick={() => choose('granted')}>{thai ? 'อนุญาตการวิเคราะห์' : 'Allow analytics'}</button></div>
  </section>;
}
