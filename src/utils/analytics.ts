type EventName =
  | 'page_view'
  | 'case_filter'
  | 'start_builder'
  | 'complete_step'
  | 'generate_blueprint'
  | 'submit_lead'
  | 'book_call_click';

export function trackEvent(event: EventName, data?: Record<string, unknown>) {
  console.log(`[Analytics] ${event}`, data ?? '');
}
