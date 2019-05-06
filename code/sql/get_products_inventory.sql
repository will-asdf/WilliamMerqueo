
SELECT i.quantity, p.product_id, p.name
 FROM inventory i
 INNER JOIN products p
 ON i.product_id = p.product_id;