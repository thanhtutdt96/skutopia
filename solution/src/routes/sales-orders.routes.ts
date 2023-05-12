import { Router } from 'express';
import {
  createOrderBookings,
  createOrderQuotes,
  createSalesOrder,
  getSalesOrders,
} from '../controllers/sales-orders.controller';

const router = Router();

router.get('/sales-orders', getSalesOrders);
router.post('/sales-orders', createSalesOrder);
router.post('/sales-orders/:id/quotes', createOrderQuotes);
router.post('/sales-orders/:id/bookings', createOrderBookings);

export default router;
