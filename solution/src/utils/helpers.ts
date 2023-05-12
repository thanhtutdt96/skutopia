import { CarrierType, SalesOrder } from '../types/common';

export const calculateCarrierFees = (carrier: CarrierType, items: SalesOrder['items']): number => {
  switch (carrier) {
    case 'UPS':
      return items.reduce((acc, item) => acc + item.gramsPerItem * 0.05, 800);
    case 'USPS':
      return items.reduce((acc, item) => acc + item.gramsPerItem * 0.02, 1050);
    case 'FEDEX':
      return items.reduce((acc, item) => acc + item.gramsPerItem * 0.03, 1000);
    default:
      throw new Error(`Unknown carrier: ${carrier}`);
  }
};

export const generateQuote = (order: SalesOrder, carrier: CarrierType) => ({
  carrier,
  priceCents: calculateCarrierFees(carrier, order.items),
});
