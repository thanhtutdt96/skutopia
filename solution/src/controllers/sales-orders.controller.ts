import { Request, Response } from 'express';
import log from '../utils/logger';
import SalesOrdersRepository from '../repositories/sales-orders.repository';
import {
  OrderStatus,
  CreateSalesOrderRequest,
  CreateShippingQuotesRequest,
  CreateBookingRequest,
} from '../types/common';
import { ErrorMessage } from '../types/error';

export const getSalesOrders = async (req: Request, res: Response): Promise<Response> => {
  const statusQuery = req.query?.status;
  const acceptedOrderStatuses: `${OrderStatus}`[] = Object.values(OrderStatus);

  if (statusQuery && !acceptedOrderStatuses.includes(statusQuery as `${OrderStatus}`)) {
    return res.status(400).json({ error: ErrorMessage.BAD_REQUEST });
  }

  try {
    const salesOrders = await SalesOrdersRepository.fetchAllOrders(
      statusQuery as `${OrderStatus}` | undefined,
    );

    return res.status(200).json({ salesOrders });
  } catch (e) {
    log.error(e);

    return res.status(500).json({ error: ErrorMessage.SERVER_ERROR });
  }
};

export const createSalesOrder = async (req: Request, res: Response): Promise<Response> => {
  const { id, customer, items: requestItems }: CreateSalesOrderRequest = req.body;

  try {
    const { salesOrder, items } = await SalesOrdersRepository.createOrder({
      id,
      customer,
      items: requestItems,
    });

    if (!salesOrder) {
      return res.status(400).json({ error: ErrorMessage.BAD_REQUEST });
    }

    return res.status(200).json({ ...salesOrder, items, quotes: [] });
  } catch (e) {
    log.error(e);

    return res.status(500).json({ error: ErrorMessage.SERVER_ERROR });
  }
};

export const createOrderQuotes = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { carriers }: CreateShippingQuotesRequest = req.body;

  try {
    const salesOrder = await SalesOrdersRepository.fetchOrderById(id);

    if (!salesOrder) {
      return res.status(404).json({ error: ErrorMessage.ORDER_NOT_FOUND });
    }

    if (salesOrder.status === OrderStatus.BOOKED) {
      return res.status(400).json({ error: ErrorMessage.ORDER_BOOKED });
    }

    if (!carriers?.length) {
      return res.status(400).json({ error: ErrorMessage.BAD_REQUEST });
    }

    const quotes = await SalesOrdersRepository.createShippingQuotes(salesOrder, carriers);

    await SalesOrdersRepository.updateOrder({
      id: salesOrder.id,
      customer: salesOrder.customer,
      status: OrderStatus.QUOTED,
      items: salesOrder.items,
    });

    return res.status(200).json({ quotes });
  } catch (e) {
    log.error(e);

    return res.status(500).json({ error: ErrorMessage.SERVER_ERROR });
  }
};

export const createOrderBookings = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { carrier }: CreateBookingRequest = req.body;

  try {
    const salesOrder = await SalesOrdersRepository.fetchOrderById(id);

    if (!salesOrder) {
      return res.status(404).json({ error: ErrorMessage.ORDER_NOT_FOUND });
    }

    if (salesOrder.status === OrderStatus.BOOKED) {
      return res.status(400).json({ error: ErrorMessage.ORDER_BOOKED });
    }

    if (!carrier) {
      return res.status(400).json({ error: ErrorMessage.BAD_REQUEST });
    }

    const { carrierBooked, carrierPricePaid } = await SalesOrdersRepository.updateOrder(
      {
        id: salesOrder.id,
        customer: salesOrder.customer,
        status: OrderStatus.BOOKED,
        items: salesOrder.items,
      },
      carrier,
    );

    await SalesOrdersRepository.createBookingDetail(salesOrder.id, carrierBooked, carrierPricePaid);

    await SalesOrdersRepository.deleteQuotesByOrderId(salesOrder.id);

    return res.status(200).json({ carrierPricePaid, carrierBooked });
  } catch (e) {
    log.error(e);

    return res.status(500).json({ error: ErrorMessage.SERVER_ERROR });
  }
};
