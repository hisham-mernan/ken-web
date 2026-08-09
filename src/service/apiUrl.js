export const apiKey = import.meta.env.VITE_REACT_APP_BASE_URL || "https://ken-back.vercel.app";
export const API = {
  list: {
    suppliers: "/supplier-dropdown/",
  },
  auth: {
    verify_otp: "/verfiy-otp/",
    sendOtp: "/resend-otp/",
    login: "/login/",
    register: "/register/",
    reset_password: "/change-forget-password/",
    google: "/auth/google-login/",
  },
  testimonials: "/api/products/testmonial/",
  home: {
    combined: "/api/products/homepage/",
    faq: "/api/content/faq/",
    event: "/api/products/events/random/",
    huts: "/api/products/huts-home/list/",
    services: "/api/products/random-services/",
    offer: "",
  },
  about_section: "/api/content/about-us/",
  parteners: "/partners/",
  events_page: {
    events: "/api/products/events/",
    details: "/api/products/events-details/web/",
  },
  about: {
    story: "/api/content/story/",
    our_service: "/api/content/our-service/",
    special_about_us: "/api/content/special-about-us/",
  },
  huts: {
    all_huts: "/api/products/huts-list/",
    details: {
      detail: "/api/products/huts/",
      special_item: "/api/products/ken-items/hut/",
    },
  },
  booking: {
    create: "/api/products/booking/",
    details: "/api/products/bookings/",
    confirm: {
      guest: "",
      upcoming_event_and_servicse: "/api/products/avliable/service/",
      update: "/api/products/booking/update/",
      extra_service: "/api/products/service-tickets/extra/",
    },
  },
  user_booking: {
    upcoming: "/api/products/bookings/upcoming/",
    past: "/api/products/bookings/past/",
    cancellation: "/api/products/booking/cancellation/",
  },

  profile: {
    get: "/user-info/",
  },
  support: "/support/create/",
  terms_and_condtions: {
    terms: "/api/content/terms-condations/",
    description: "/api/content/terms-titles/",
  },
  rating: {
    review: "/api/products/rate/",
    website_rate: "/api/content/ken/avg-rate/",
  },
  services: "/api/products/service-suppliers/list/",
  payment: {
    details: "/api/products/booking/payment-details/",
    checkout: "/api/payments/create-checkout/",
    callback: "/api/payments/verify-payment/",
  },
};
