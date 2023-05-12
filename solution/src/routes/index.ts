import express from 'express';
import salesOrdersRoutes from './sales-orders.routes';

const indexRoutes = express();

indexRoutes.use(salesOrdersRoutes);

export default indexRoutes;
