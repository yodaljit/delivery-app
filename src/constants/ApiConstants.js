const config = require('../../package.json').projectConfig;
const BACKEND_BASE_URL = config.backendApiBaseUrl;

const COUNTRY_FLAG = {
  BASE_URL: `https://www.countryflags.io`,
  SIZE: {16: '16', 24: '24', 32: '32', 48: '48', 64: '64'},
  STYLE: {FLAT: 'flat', SHINY: 'shiny'},
};

const STATIC_IMAGE = {
  BASE_URL: `${BACKEND_BASE_URL}/images`,
  TYPE: {POSTER: 'poster', LOGO: 'logo', GALLERY: 'gallery'},
  SIZE: {SQUARE: 'square', LANDSCAPE: 'landscape', PORTRAIT: 'portrait'},
  QUALITY: {SD: 'sd', HD: 'hd'},
};
// const BACKEND_API = {
//   BASE_API_URL: `${BACKEND_BASE_URL}/api`,
//   REGISTER: '/register',
//   LOGIN: '/login',
//   USER_EXIST: '/user-exist',
//   USER: '/user',
//   REFRESH_TOKEN: '/refresh-token',
//   RESTAURANT: '/restaurant',
//   CART: '/cart',
//   FOOD: '/food',
//   BOOKMARK: '/bookmark',
// };

const BACKEND_API = {
  BASE_API_URL: BACKEND_BASE_URL,
  LOGIN: '/api/auth/customer/signup-login/',
  VERIFY_LOGIN: '/api/auth/customer/verify-otp/',
  USER_EXIST: '/auth/user-exist',
  USER: '/api/auth',
  REFRESH_TOKEN: '/auth/refresh-token',
  RESTAURANT: '/api/restaurants/outlets/',
  RESTAURANT_DETAIL: '/api/restaurants/vendors/',
  CART: '/api/cart/cart/',
  FOOD: '/api/restaurants nu-items',
  BOOKMARK: '/restaurants/bookmark',
  ORDER: '/api/orders/history/',
  PLACE_ORDER: '/api/orders/place-order/',
  GET_ADDRESSES: '/api/auth/addresses/',
  
  
  DELIVERY_BASE: '/api/delivery/',
  DELIVERY_ASSIGN: '/api/delivery/assign/',
  DELIVERY_UPDATE_STATUS: (id) => `/api/delivery/${id}/update-status/`,
  MY_DELIVERIES: '/api/delivery/my-deliveries/',

  
  // Vendor delivery login
  VENDOR_DELIVERY_LOGIN: '/api/auth/vendor-delivery/login/',
  
  // New endpoint for updating delivery person availability
  DELIVERY_PERSON_AVAILABILITY: '/api/delivery/delivery-person/availability/',
};

// Socket configuration
const SOCKET = {
  BASE_URL: `ws://${BACKEND_BASE_URL.replace(/^https?:\/\//, '')}`, // Remove http:// or https:// from BACKEND_BASE_URL
  NOTIFICATIONS: '/ws/notifications/',
};

export default { COUNTRY_FLAG, BACKEND_API, STATIC_IMAGE, SOCKET };
