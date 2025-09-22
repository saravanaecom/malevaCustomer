// Simple store for selected order ID
let selectedOrderId = null;

export const setSelectedOrderId = (orderId) => {
  selectedOrderId = orderId;
  console.log('Selected Order ID stored:', orderId);
};

export const getSelectedOrderId = () => {
  return selectedOrderId;
};

export const clearSelectedOrderId = () => {
  selectedOrderId = null;
};