
 CREATE TEMPORARY TABLE less_sold(product_id integer, name text, quantity integer);

 CREATE TEMPORARY TABLE order_products_groups AS 
 SELECT op.product_id , SUM(op.quantity) as quantity
 FROM orders_products op
 GROUP BY op.product_id;

 CREATE TEMPORARY TABLE min_quantity AS 
 SELECT opg.quantity
 FROM order_products_groups opg
 ORDER BY opg.quantity ASC
 LIMIT 1;

 INSERT INTO less_sold(product_id, name, quantity)
 SELECT opg.product_id, p.name, opg.quantity
 FROM min_quantity v
 INNER JOIN order_products_groups opg
 ON v.quantity = opg.quantity
 INNER JOIN products p
 ON opg.product_id = p.product_id;

 INSERT INTO less_sold(product_id, name, quantity)
 SELECT p.product_id, p.name, 0
 FROM products p
 LEFT JOIN orders_products op
 ON p.product_id = op.product_id
 WHERE op.product_id IS NULL;

 SELECT *
 FROM less_sold;

 DROP TABLE IF EXISTS min_quantity;
 DROP TABLE IF EXISTS order_products_groups;
 DROP TABLE IF EXISTS less_sold;
