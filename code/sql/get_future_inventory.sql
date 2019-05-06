
CREATE TEMPORARY TABLE sold_products AS 
 SELECT p.product_id, SUM(ifnull(op.quantity, 0)) AS quantity
 FROM products p
 LEFT JOIN orders_products op
 ON p.product_id = op.product_id
 GROUP BY p.product_id;

 CREATE TEMPORARY TABLE inventory_products AS 
 SELECT p.product_id, ifnull(i.quantity, 0) AS quantity
 FROM products p
 LEFT JOIN inventory i
 ON p.product_id = i.product_id;

 SELECT p.product_id, p.name, 
 CASE 
  WHEN sp.quantity >= ip.quantity THEN 0
  ELSE ip.quantity - sp.quantity
  END AS quantity
 FROM products p
 LEFT JOIN sold_products sp
 ON p.product_id = sp.product_id
  LEFT JOIN inventory_products ip
 ON p.product_id = ip.product_id;

 DROP TABLE IF EXISTS sold_products;

 DROP TABLE IF EXISTS inventory_products;