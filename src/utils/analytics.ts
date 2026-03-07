type EventName =
  | 'page_view'
  | 'case_filter'
  | 'start_builder'
  | 'complete_step'
  | 'generate_blueprint'
  | 'submit_lead'
  | 'book_call_click'
  | 'lens_page_view'
  | 'lens_start'
  | 'lens_complete_step'
  | 'lens_generate_result'
  | 'lens_submit_lead'
  | 'lens_email_result_click'
  | 'lens_continue_to_builder'
  | 'lens_explore_work_click'
  | 'lens_book_call_click';

export function trackEvent(event: EventName, data?: Record<string, unknown>) {
  console.log(`[Analytics] ${event}`, data ?? '');
}
