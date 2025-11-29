declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const GA_EVENTS = {
  FILE_UPLOAD: "file_upload",
  PROCESS_START: "process_start",
  FILE_DOWNLOAD: "file_download",
  LOGIN: "login",
  REGISTER: "sign_up",
  PAYMENT_INITIATE: "begin_checkout",
};

export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  } else {
    console.warn("GA4 not initialized", eventName, params);
  }
}

