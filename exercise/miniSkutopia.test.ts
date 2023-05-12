import axios, {Axios} from "axios";
import {expect} from "chai";
import {calculateCarrierFees, generateQuote, loadFixture, SalesOrder} from "./util";

const apiClient = axios.create({
    baseURL: "http://localhost:8044/",
    validateStatus: function (status) {
        return status < 500; // Resolve only if the status code is less than 500
    }
});

const ORDERS = loadFixture<{salesOrders: SalesOrder[]}>('sales-orders.json').salesOrders;

describe('A mini SKUTOPIA API', () => {
    it('should successfully receive a sales order', async () => {
        const result = await apiClient.post('http://localhost:8044/sales-orders', ORDERS[0]);
        expect(result.status).to.eq(200);
        expect(result.data).to.deep.eq({
            ...ORDERS[0],
            quotes: [],
            status: 'RECEIVED'
        });
    });
    it('should list all sales orders', async () => {
        const result = await apiClient.get('/sales-orders');
        expect(result.status).to.eq(200);
        expect(result.data).to.deep.eq({
            salesOrders: [{...ORDERS[0], status: 'RECEIVED', quotes: []}],
        });
    });
    it('should list the BOOKED sales orders', async () => {
        const result = await apiClient.get('/sales-orders?status=BOOKED');
        expect(result.status).to.eq(200);
        expect(result.data).to.deep.eq({
            salesOrders: [],
        });
    });
    it('should generate a quote for a RECEIVED sales order', async () => {
        const result = await apiClient.post(`/sales-orders/${ORDERS[0].id}/quotes`, {
            carriers: ['UPS', 'USPS', 'FEDEX'],
        });
        expect(result.status).to.eq(200);
        expect(result.data).to.deep.eq({
            quotes: [
                generateQuote(ORDERS[0], 'UPS'),
                generateQuote(ORDERS[0], 'USPS'),
                generateQuote(ORDERS[0], 'FEDEX'),
            ],
        });
    });
    it('should return an error for a non-existent sales order', async () => {
        const result = await apiClient.post(`/sales-orders/123456/quotes`);
        expect(result.status).to.eq(404);
        expect(result.data).to.deep.eq({
            error: 'Sales order not found',
        });
    });
    it('should successfully book an order', async () => {
        const result = await apiClient.post(`/sales-orders/${ORDERS[0].id}/bookings`, {
            carrier: 'UPS',
        });
        expect(result.status).to.eq(200);
        expect(result.data).to.deep.eq({
            carrierPricePaid: calculateCarrierFees('UPS', ORDERS[0].items),
            carrierBooked: 'UPS'
        });
    });
    it('should return an error when requesting a quote for a BOOKED order', async () => {
        const result = await apiClient.post(`/sales-orders/${ORDERS[0].id}/quotes`);
        expect(result.status).to.eq(400);
        expect(result.data).to.deep.eq({
            error: 'Sales order is already booked',
        });
    });
    it('receives more orders', async () => {
        const result1 = apiClient.post('/sales-orders', ORDERS[1]);
        const result2 = apiClient.post('/sales-orders', ORDERS[2]);
        expect((await result1).status).to.eq(200);
        expect((await result2).status).to.eq(200);
    });
    it('should list all sales orders', async () => {
        const result = await apiClient.get('/sales-orders');
        expect(result.status).to.eq(200);
        expect(result.data).to.deep.eq({
            salesOrders: [
                {...ORDERS[0], status: 'BOOKED', carrierPricePaid: calculateCarrierFees('UPS', ORDERS[0].items), carrierBooked: 'UPS', quotes: []},
                {...ORDERS[1], status: 'RECEIVED', quotes: []},
                {...ORDERS[2], status: 'RECEIVED', quotes: []},
            ],
        });
    });
});