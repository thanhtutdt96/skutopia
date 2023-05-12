-- -------------------------------------------------------------
-- TablePlus 5.3.6(496)
--
-- https://tableplus.com/
--
-- Database: skutopia
-- Generation Time: 2023-05-01 23:12:45.8920
-- -------------------------------------------------------------


DROP TABLE IF EXISTS "public"."bookings";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS bookings_id_seq;

-- Table Definition
CREATE TABLE "public"."bookings" (
    "sales_orders_id" text NOT NULL DEFAULT nextval('bookings_id_seq'::regclass),
    "carrierBooked" text NOT NULL,
    "carrierPricePaid" float8 NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY ("sales_orders_id")
);

DROP TABLE IF EXISTS "public"."items";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS items_id_seq1;

-- Table Definition
CREATE TABLE "public"."items" (
    "id" int4 NOT NULL DEFAULT nextval('items_id_seq1'::regclass),
    "sku" text NOT NULL,
    "quantity" int4 NOT NULL,
    "gramsPerItem" float8 NOT NULL,
    "price" float8 NOT NULL,
    "sales_orders_id" text NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."quotes";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS quotes_id_seq;

-- Table Definition
CREATE TABLE "public"."quotes" (
    "id" int4 NOT NULL DEFAULT nextval('quotes_id_seq'::regclass),
    "carrier" text NOT NULL,
    "priceCents" float8 NOT NULL,
    "sales_orders_id" text NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."sales_orders";
-- This script only contains the table creation statements and does not fully represent the table in the database. It's still missing: indices, triggers. Do not use it as a backup.

-- Table Definition
CREATE TABLE "public"."sales_orders" (
    "id" text NOT NULL,
    "status" varchar(50) NOT NULL,
    "customer" text NOT NULL,
    "carrierPricePaid" float8,
    "carrierBooked" varchar(50),
    "created_at" timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY ("id")
);

ALTER TABLE "public"."bookings" ADD FOREIGN KEY ("sales_orders_id") REFERENCES "public"."sales_orders"("id");
ALTER TABLE "public"."items" ADD FOREIGN KEY ("sales_orders_id") REFERENCES "public"."sales_orders"("id");
ALTER TABLE "public"."quotes" ADD FOREIGN KEY ("sales_orders_id") REFERENCES "public"."sales_orders"("id");
