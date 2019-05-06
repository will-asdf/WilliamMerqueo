
CREATE TABLE IF NOT EXISTS orders_groups ( 
    order_group_id integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    address text,
	user_id integer,
	relevant_priority integer,
	num_orders integer
 );

 INSERT INTO orders_groups(address, user_id, relevant_priority, num_orders)  
 SELECT o.address,
 o.user_id,
 MIN(o.priority) AS relevant_priority,
 COUNT(o.order_id) AS num_orders
 FROM orders o
 GROUP BY o.address, o.user_id
 ORDER BY MIN(o.priority) ASC, COUNT(o.order_id) DESC, o.user_id, o.address;

 CREATE TEMPORARY TABLE ordered_orders AS 
 SELECT og.order_group_id, o.order_id, o.address, o.user_id, u.name as user_name
 FROM orders_groups og
 INNER JOIN orders o
 ON og.address = o.address AND og.user_id = o.user_id
 INNER JOIN users u
 ON o.user_id = u.user_id
 ORDER BY og.order_group_id ASC;

 SELECT *
 FROM ordered_orders;

 SELECT oo.order_id, p.product_id, p.name, op.quantity
 FROM ordered_orders oo
 INNER JOIN orders_products op
 ON oo.order_id = op.order_id
 INNER JOIN products p
 ON op.product_id = p.product_id;

 DROP TABLE IF EXISTS orders_groups;

 DROP TABLE IF EXISTS ordered_orders;