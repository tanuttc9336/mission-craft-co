const isDev = import.meta.env.DEV;

export function trackEvent(event: string, properties?: Record<string, unknown>): void {
  if (isDev) {
    console.log('[analytics]', event, properties ?? {});
  }
  // TODO: wire to your analytics provider (e.g. Plausible, PostHog, Segment)
}
