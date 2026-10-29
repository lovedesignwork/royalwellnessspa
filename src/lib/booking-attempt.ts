import { createHash } from 'node:crypto';

// The database primary key makes simultaneous retries atomic across server instances.
// Include the submitted details so edited bookings cannot reuse an old payment amount.
export function bookingAttemptId(key: string, details: unknown): string {
  const hex = createHash('sha256').update(`spa-booking:v1:${key}:${JSON.stringify(details)}`).digest('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}

export function validBookingAttempt(key: string | null): key is string {
  return !!key && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(key);
}
