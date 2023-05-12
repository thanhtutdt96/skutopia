# Project - *SKUTOPIA mini app*

Built with Node.js, Express, PostgresSQL, TypeScript, Eslint.

## Install

### Prerequisites

- [Node.js](https://formulae.brew.sh/formula/node@14)
- [Postgres](https://formulae.brew.sh/formula/postgresql@14)

### Development

- Import the database dump in `solution/database/skutopia_***.sql` using any GUI or following command

```
psql -U <username> -d <database_name> -f <sql_file>
```

- Rename `.env.example` to `.env` (if `.env` file does not exists). Update the connection information to match the
  database which imported the database dump.
- Install dependencies

```
npm install
```

- Start dev server. Then the server should be ready on http://localhost:8044

```
npm run dev
```

### Linting / Format

```
yarn lint
yarn format
```

## Main Features

The following functionalities are implemented:

- [x] `GET /sales-orders` Returns a list of all sales orders.
- [x] `POST /sales-orders` Creates a new sales order.
- [x] `POST /sales-orders/:id/quotes`
  Generate quotes for a sales order for the given carriers and returns the quotes. Updates the sales order status
  to `QUOTED`.
- [x] `POST /sales-orders/:id/bookings` Creates a booking for the given carrier and updates the sales order status
  to `BOOKED`. Returns the booking details. If a quote for the requested carrier booking is not available, returns a 400
  error.

## License

```
MIT License

Copyright 2023 by Tu Pham
```
