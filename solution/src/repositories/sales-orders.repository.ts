import format from 'pg-format';
import pool from '../config/database';
import { calculateCarrierFees, generateQuote } from '../utils/helpers';
import {
  CarrierType,
  Item,
  OrderStatus,
  SalesOrder,
  CreateSalesOrderRequest,
  ShippingQuote,
  UpdateSalesOrderRequest,
} from '../types/common';
import {
  createBookingDetailQuery,
  createItemQuery,
  createOrderQuery,
  createShippingQuotesQuery,
  deleteQuotesByOrderIdQuery,
  fetchAllOrdersByStatusQuery,
  fetchAllOrdersQuery,
  fetchOrderByIdQuery,
  fetchOrderByIdStatusQuery,
  updateOrderQuery,
} from '../queries/sales-orders.query';

const SalesOrdersRepository = (() => {
  const fetchAllOrders = async (status?: `${OrderStatus}`) => {
    const salesOrders = await pool.query<SalesOrder>(
      status ? fetchAllOrdersByStatusQuery : fetchAllOrdersQuery,
      status ? [status] : undefined,
    );

    return salesOrders.rows?.map((order) => {
      if (order.carrierBooked === null) {
        delete order.carrierBooked;
      }

      if (order.carrierPricePaid === null) {
        delete order.carrierPricePaid;
      }

      return order;
    });
  };

  const fetchOrderById = async (id: string, status?: `${OrderStatus}`) => {
    const salesOrders = await pool.query<SalesOrder>(
      status ? fetchOrderByIdStatusQuery : fetchOrderByIdQuery,
      status ? [id, status] : [id],
    );

    const [salesOrder] = salesOrders.rows;

    return salesOrder;
  };

  const createOrder = async ({ id, customer, items: requestItems }: CreateSalesOrderRequest) => {
    const salesOrders = await pool.query<SalesOrder>(createOrderQuery, [
      id,
      OrderStatus.RECEIVED,
      customer,
    ]);

    const [salesOrder] = salesOrders.rows;

    if (!salesOrder?.id) {
      return {
        salesOrder: null,
        items: [],
      };
    }

    const queryItems = requestItems.map((item) => [...Object.values(item), salesOrder.id]);
    const items = await pool.query<Item>(format(createItemQuery, queryItems), []);

    return {
      salesOrder,
      items: items.rows,
    };
  };

  const updateOrder = async (
    { id, customer, status, items }: UpdateSalesOrderRequest,
    carrier?: CarrierType,
  ) => {
    const isBookingOrder = status === OrderStatus.BOOKED;

    let carrierPricePaid = null;

    if (isBookingOrder && carrier) {
      carrierPricePaid = calculateCarrierFees(carrier, items);
    }

    const salesOrders = await pool.query<SalesOrder>(updateOrderQuery, [
      id,
      status,
      customer,
      carrierPricePaid,
      carrier ?? null,
    ]);

    const [salesOrder] = salesOrders.rows;

    return salesOrder;
  };

  const createShippingQuotes = async (order: SalesOrder, carriers: CarrierType[]) => {
    const quotes = carriers.map((carrier) => generateQuote(order, carrier));

    const queryQuotes = quotes.map((item) => [...Object.values(item), order.id]);
    const resultQuotes = await pool.query<ShippingQuote>(
      format(createShippingQuotesQuery, queryQuotes),
      [],
    );

    return resultQuotes.rows;
  };

  const createBookingDetail = async (
    id: string,
    carrierBooked?: CarrierType,
    carrierPricePaid?: number,
  ) => {
    const booking = await pool.query(createBookingDetailQuery, [
      id,
      carrierBooked,
      carrierPricePaid,
    ]);

    return booking.rows;
  };

  const deleteQuotesByOrderId = async (orderId: string) => {
    const quotes = await pool.query<ShippingQuote>(deleteQuotesByOrderIdQuery, [orderId]);

    return quotes.rows;
  };

  return {
    fetchAllOrders,
    createOrder,
    updateOrder,
    fetchOrderById,
    createShippingQuotes,
    createBookingDetail,
    deleteQuotesByOrderId,
  };
})();

export default SalesOrdersRepository;
