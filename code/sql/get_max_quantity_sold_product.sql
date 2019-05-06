 
 CREATE TEMPORARY TABLE order_products_groups AS 
 SELECT op.product_id , SUM(op.quantity) as quantity
 FROM orders_products op
 GROUP BY op.product_id;

 CREATE TEMPORARY TABLE max_quantity AS 
 SELECT opg.quantity
 FROM order_products_groups opg
 ORDER BY opg.quantity DESC
 LIMIT 1;

 SELECT opg.product_id, p.name, opg.quantity
 FROM max_quantity v
 INNER JOIN order_products_groups opg
 ON v.quantity = opg.quantity
 INNER JOIN products p
 ON opg.product_id = p.product_id;

 DROP TABLE IF EXISTS max_quantity;
 DROP TABLE IF EXISTS order_products_groups;