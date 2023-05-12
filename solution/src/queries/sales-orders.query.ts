export const fetchAllOrdersQuery = `
  SELECT s.id,
    s.status,
    s.customer,
    s."carrierBooked",
    s."carrierPricePaid",
    items,
    quotes
  FROM sales_orders s
  LEFT JOIN LATERAL (
    SELECT COALESCE(json_agg((SELECT x
        FROM (SELECT i.sku,
            i.quantity,
            i.price,
            i."gramsPerItem") AS x)) FILTER (WHERE i.id IS NOT NULL), '[]') AS items
    FROM items i
    WHERE s.id = i.sales_orders_id) i ON TRUE
  LEFT JOIN LATERAL (
    SELECT COALESCE(json_agg((SELECT y
        FROM (SELECT q.carrier,
            q."priceCents") AS y)) FILTER (WHERE q.id IS NOT NULL), '[]') AS quotes
    FROM quotes q
    WHERE s.id = q.sales_orders_id) q ON TRUE
  ORDER BY s.id
`;

export const fetchAllOrdersByStatusQuery = `
  SELECT s.id,
    s.status,
    s.customer,
    s."carrierBooked",
    s."carrierPricePaid",
    items,
    quotes
  FROM sales_orders s
  LEFT JOIN LATERAL (
    SELECT COALESCE(json_agg((SELECT x
        FROM (SELECT i.sku,
            i.quantity,
            i.price,
            i."gramsPerItem") AS x)) FILTER (WHERE i.id IS NOT NULL), '[]') AS items
    FROM items i
    WHERE s.id = i.sales_orders_id) i ON TRUE
  LEFT JOIN LATERAL (
    SELECT COALESCE(json_agg((SELECT y
        FROM (SELECT q.carrier,
            q."priceCents") AS y)) FILTER (WHERE q.id IS NOT NULL), '[]') AS quotes
    FROM quotes q
    WHERE s.id = q.sales_orders_id) q ON TRUE
  WHERE s.status = $1
  ORDER BY s.id
`;

export const fetchOrderByIdQuery = `
  SELECT s.id,
    s.status,
    s.customer,
    items
  FROM sales_orders s
  LEFT JOIN LATERAL (
    SELECT COALESCE(json_agg((SELECT x
        FROM (SELECT i.sku,
            i.quantity,
            i.price,
            i."gramsPerItem") AS x)) FILTER (WHERE i.id IS NOT NULL), '[]') AS items
    FROM items i
    WHERE s.id = i.sales_orders_id) i ON TRUE
  WHERE s.id = $1
`;

export const fetchOrderByIdStatusQuery = `
  SELECT s.id,
    s.status,
    s.customer,
    items
  FROM sales_orders s
  LEFT JOIN LATERAL (
    SELECT COALESCE(json_agg((SELECT x
        FROM (SELECT i.sku,
            i.quantity,
            i.price,
            i."gramsPerItem") AS x)) FILTER (WHERE i.id IS NOT NULL), '[]') AS items
    FROM items i
    WHERE s.id = i.sales_orders_id) i ON TRUE
  WHERE s.id = $1 AND s.status = $2
`;

export const createOrderQuery = `INSERT INTO sales_orders (id, status, customer) VALUES ($1, $2, $3) RETURNING id, status, customer`;

export const createItemQuery = `INSERT INTO items (sku, quantity, "gramsPerItem", price, sales_orders_id) VALUES %L RETURNING sku, quantity, "gramsPerItem", price`;

export const createShippingQuotesQuery = `
  INSERT INTO quotes (carrier, "priceCents", sales_orders_id)
  VALUES %L
  RETURNING
    carrier, "priceCents"
`;

export const updateOrderQuery = `
  UPDATE sales_orders
  SET status = $2, customer = $3, "carrierPricePaid" = $4, "carrierBooked" = $5
  WHERE id = $1
  RETURNING id, customer, status, "carrierPricePaid", "carrierBooked"
`;

export const createBookingDetailQuery = `
  INSERT INTO bookings (sales_orders_id, "carrierBooked", "carrierPricePaid")
  VALUES ($1, $2, $3)
`;

export const deleteQuotesByOrderIdQuery = `DELETE FROM quotes where sales_orders_id = $1`;
