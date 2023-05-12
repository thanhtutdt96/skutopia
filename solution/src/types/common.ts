export type CarrierType = 'UPS' | 'FEDEX' | 'USPS';

export enum OrderStatus {
  RECEIVED = 'RECEIVED',
  QUOTED = 'QUOTED',
  BOOKED = 'BOOKED',
  CANCELLED = 'CANCELLED',
}

export type SalesOrder = {
  id: string;
  status: `${OrderStatus}`;
  customer: string;
  items: Item[];
  carrierPricePaid?: number;
  carrierBooked?: CarrierType;
  quotes: ShippingQuote[];
};

export type Item = {
  id: number;
  sku: string;
  quantity: number;
  gramsPerItem: number;
  price: number;
};

export type ShippingQuote = {
  id: number;
  carrier: CarrierType;
  priceCents: number;
};

export type CreateSalesOrderRequest = Pick<SalesOrder, 'id' | 'customer'> & {
  items: Pick<Item, 'sku' | 'quantity' | 'gramsPerItem' | 'price'>[];
};

export type CreateShippingQuotesRequest = {
  carriers: CarrierType[];
};

export type UpdateSalesOrderRequest = Pick<SalesOrder, 'id' | 'status' | 'customer' | 'items'>;

export type CreateBookingRequest = {
  carrier: CarrierType;
};
