-- Add GIN index for JSONB product attributes.
-- Kept as a separate additive migration so an already deployed init migration does not need rewriting.
CREATE INDEX IF NOT EXISTS "products_attributes_gin_idx"
ON "products"
USING GIN ("attributes" jsonb_path_ops);
