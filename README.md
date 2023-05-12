# Take-home API Exercise

In this task you will have to create a server running on port `8044` that will receive orders, keep track of their state, allow a caller to request quotes, and finally book a shipment. 

Aim to complete this exercise within two hours. You can use an in-memory database if it saves you time.

We will be considering:

* **Readability:** Can we easily follow your code? have you chosen intention revealing names? Do functions do what they say, and are they constrained to a single level of abstraction?
* **Testability:** Is your code written in a way that it could easily be tested? Would the tests provide a good return on investment in terms of effort to maintain versus defects prevented?
* **Maintainability:** Is your code written in a way that it could easily be maintained? Is it a simple solution that can be easily refactored?

And of course it has to work.

## Solving the problem

First install the dependencies via `npm ci`

Then run the test with `npm test`

Now in the `./solution` directory, build your webserver running on port `8044` and get the test suite to pass. You should include instructions so that we can run your server locally ourselves. You can use any language you like, as long as we can follow your instructions to run it.

Then zip up this whole directory and send it back to us.

## API Specifications

### `GET /sales-orders`

Returns a list of all sales orders in the system.

#### Response Schema

```ts
{
    salesOrders: Array<{
        id: string,
        status: 'RECEIVED' | 'QUOTED' | 'BOOKED' | 'CANCELLED',
        customer: string,
        items: Array<{
            sku: string,
            quantity: number,
            gramsPerItem: number,
            price: number
        }>
        carrierPricePaid?: number;
        carrierBooked?: 'UPS' | 'FEDEX' | 'USPS';
        quotes: Array<{
            carrier: 'UPS' | 'FEDEX' | 'USPS',
            priceCents: number
        }>
    }>
}
```

#### Filters

 * `status`: filter by status, e.g. `/sales-orders?status=RECEIVED`

### `POST /sales-orders`

Creates a new sales order

#### Request Schema

```ts
{
    id: string;
    customer: string;
    items: Array<{
        sku: string,
        quantity: number,
        gramsPerItem: number,
        price: number
    }>
}
```

#### Response Schema

```ts
{
    id: string;
    status: 'RECEIVED';
    customer: string;
    items: Array<{
        sku: string,
        quantity: number,
        gramsPerItem: number,
        price: number
    }>
    quotes: [];
}
```

### `POST /sales-orders/:id/quotes`

Generate quotes for a sales order for the given carriers and returns the quotes. Updates the sales order status to `QUOTED`.

#### Request Schema

```ts
{
    carriers: Array<'UPS' | 'FEDEX' | 'USPS'>
}
```

#### Response Schema

```ts
{
    quotes: Array<{
        carrier: 'UPS' | 'FEDEX' | 'USPS',
        priceCents: number
    }>
}
```

### `POST /sales-orders/:id/bookings`

 * Creates a booking for the given carrier and updates the sales order status to `BOOKED`.
 * Returns the booking details.
 * If a quote for the requested carrier booking is not available, returns a 400 error.

#### Request Schema

```ts
{
    carrier: 'UPS' | 'FEDEX' | 'USPS'
}
```

#### Response Schema

```ts
{
    carrierBooked: 'UPS' | 'FEDEX' | 'USPS';
    carrierPricePaid: number;
}
```