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
  | 'lens_submit_context'
  | 'lens_generate_session'
  | 'lens_complete_slide'
  | 'lens_save_result'
  | 'lens_submit_lead'
  | 'lens_email_result_click'
  | 'lens_continue_to_builder'
  | 'lens_explore_work_click'
  | 'lens_book_call_click'
  | 'portal_login'
  | 'portal_view_dashboard'
  | 'portal_view_timeline'
  | 'portal_view_deliverables'
  | 'portal_view_reviews'
  | 'portal_submit_feedback'
  | 'portal_open_file'
  | 'portal_view_brief'
  | 'portal_view_next_steps'
  | 'portal_logout';

export function trackEvent(event: EventName, data?: Record<string, unknown>) {
  console.log(`[Analytics] ${event}`, data ?? '');
}
