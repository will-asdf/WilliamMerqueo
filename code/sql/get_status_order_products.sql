
SELECT p.product_id, p.name,
 op.quantity AS requested_quantity,
 ifnull(i.quantity, 0) AS inventory_quantity,
  CASE 
  WHEN op.quantity > ifnull(i.quantity, 0) THEN op.quantity - ifnull(i.quantity, 0)
  ELSE 0
  END AS quantity_to_supply
 FROM orders_products op
 INNER JOIN products p
 ON op.product_id = p.product_id
 LEFT JOIN inventory i
 ON op.product_id = i.product_id
 WHERE op.order_id = {order_id};