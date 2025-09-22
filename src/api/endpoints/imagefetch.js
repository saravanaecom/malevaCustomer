export const IMAGEFETCH_ENDPOINTS = {
    FETCH_IMAGE: '/api/CommonApp/FetchImagesRecursive',
    GET_BY_ID: (id) => `/api/orders/${id}`,
    CREATE: '/api/orders',
    UPDATE: (id) => `/api/orders/${id}`,
    DELETE: (id) => `/api/orders/${id}`,
    GET_STATUS: '/api/orders/status',
    GET_HISTORY: (id) => `/api/orders/${id}/history`,
  };
  
  export default IMAGEFETCH_ENDPOINTS;