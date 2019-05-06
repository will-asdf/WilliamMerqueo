
CREATE TABLE IF NOT EXISTS users ( 
    user_id integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    name text NOT NULL UNIQUE
 );

CREATE TABLE IF NOT EXISTS orders ( 
    order_id integer NOT NULL PRIMARY KEY,
	priority integer NOT NULL,
	address text NOT NULL,
	user_id integer NOT NULL,
    delivery_date text NOT NULL,
	FOREIGN KEY (user_id) REFERENCES users(user_id)
 );

CREATE TABLE IF NOT EXISTS products ( 
    product_id integer NOT NULL PRIMARY KEY,
    name text NOT NULL
 );

CREATE TABLE IF NOT EXISTS providers ( 
    provider_id integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    name text NOT NULL UNIQUE
 );

CREATE TABLE IF NOT EXISTS orders_products ( 
    order_id integer NOT NULL,
	product_id integer NOT NULL,
	quantity integer NOT NULL,
	FOREIGN KEY (order_id) REFERENCES orders(order_id),
	FOREIGN KEY (product_id) REFERENCES products(product_id)
 );

 CREATE TABLE IF NOT EXISTS providers_products ( 
    provider_id integer NOT NULL,
	product_id integer NOT NULL,
	FOREIGN KEY (provider_id) REFERENCES providers(provider_id),
	FOREIGN KEY (product_id) REFERENCES products(product_id)
 );

  CREATE TABLE IF NOT EXISTS inventory ( 
    inventory_id integer NOT NULL PRIMARY KEY AUTOINCREMENT,
	product_id integer NOT NULL,
	quantity integer NOT NULL,
	inventory_date text NOT NULL,
	FOREIGN KEY (product_id) REFERENCES products(product_id)
 );