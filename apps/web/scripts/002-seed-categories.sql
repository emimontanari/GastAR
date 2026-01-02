-- Seed default categories for new users
-- This script creates common expense categories

INSERT INTO categories (user_id, name, icon, color)
SELECT auth.uid(), name, icon, color
FROM (VALUES
  ('Alimentación', '🍔', '#FF6B6B'),
  ('Transporte', '🚗', '#4ECDC4'),
  ('Entretenimiento', '🎮', '#45B7D1'),
  ('Salud', '💊', '#96CEB4'),
  ('Educación', '📚', '#FFEAA7'),
  ('Hogar', '🏠', '#DDA0DD'),
  ('Trabajo', '💼', '#98D8C8'),
  ('Ropa', '👕', '#F7DC6F'),
  ('Servicios', '⚡', '#85C1E9'),
  ('Otros', '📦', '#ABB2B9')
) AS defaults(name, icon, color)
WHERE auth.uid() IS NOT NULL;
