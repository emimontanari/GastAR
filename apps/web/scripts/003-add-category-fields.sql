-- Add category_name and category_icon fields to transactions table
-- This allows storing category info even for predefined categories

ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS category_name TEXT,
ADD COLUMN IF NOT EXISTS category_icon TEXT;
