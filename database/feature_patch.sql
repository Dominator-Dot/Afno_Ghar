BEGIN;

-- Prevent duplicate production stages for the same order item.
CREATE UNIQUE INDEX IF NOT EXISTS uq_production_tracking_item_stage
ON production_tracking(order_item_id, stage_id);

-- Extra gateway fields while keeping your existing payments table.
ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS gateway_transaction_id VARCHAR(150),
  ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS gateway_response JSONB;

CREATE UNIQUE INDEX IF NOT EXISTS uq_payments_gateway_transaction
ON payments(payment_method, gateway_transaction_id)
WHERE gateway_transaction_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_tracking_order_item ON production_tracking(order_item_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Demo customization availability for all currently customizable products.
INSERT INTO product_materials (product_id, material_id, additional_price, is_available)
SELECT p.id, m.id,
       CASE m.name
         WHEN 'Sal Wood' THEN 3000
         WHEN 'Sisau Wood' THEN 6000
         WHEN 'Plywood' THEN 1500
         WHEN 'MDF' THEN 1000
         WHEN 'Metal' THEN 4000
         ELSE 0
       END,
       TRUE
FROM products p CROSS JOIN materials m
WHERE p.is_customizable = TRUE
ON CONFLICT (product_id, material_id) DO NOTHING;

INSERT INTO product_colors (product_id, color_id, additional_price, is_available)
SELECT p.id, c.id,
       CASE c.name
         WHEN 'Natural Brown' THEN 0
         WHEN 'Dark Walnut' THEN 1000
         WHEN 'White' THEN 500
         WHEN 'Black' THEN 500
         WHEN 'Cream' THEN 500
         ELSE 0
       END,
       TRUE
FROM products p CROSS JOIN colors c
WHERE p.is_customizable = TRUE
ON CONFLICT (product_id, color_id) DO NOTHING;

COMMIT;
