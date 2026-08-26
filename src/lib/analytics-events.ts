/**
 * Central registry of analytics event names. Every call site must import
 * from here — never hardcode an event-name string literal in a component.
 */
export const ANALYTICS_EVENTS = {
  heroPrimaryClick: "hero_primary_click",
  whatsappClick: "whatsapp_click",
  servicesView: "services_view",
  processExpand: "process_expand",
  eligibilityStart: "eligibility_start",
  eligibilityComplete: "eligibility_complete",
  formStart: "form_start",
  formError: "form_error",
  formSubmit: "form_submit",
  admissionOpen: "admission_open",
  storyOpen: "story_open",
  scroll50: "scroll_50",
  scroll90: "scroll_90",
} as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];
