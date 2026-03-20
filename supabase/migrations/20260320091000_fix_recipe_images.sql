-- Fix recipe images - ensure all recipes have correct image URLs
-- Run this to verify and update the images

-- Debug: Check current image URLs before update
SELECT title, image_url FROM recipes WHERE title IN (
    'Strawberry Matcha Foam Latte',
    'Matcha Frappe', 
    'Iced Matcha Latte',
    'Hot Matcha Latte'
);

-- Update images with correct paths
UPDATE recipes 
SET image_url = '/images/strawberry-foam-hero.jpg' 
WHERE title = 'Strawberry Matcha Foam Latte';

UPDATE recipes 
SET image_url = '/images/matcha-frappe-hero.jpg' 
WHERE title = 'Matcha Frappe';

UPDATE recipes 
SET image_url = '/images/iced-matcha-latte-hero.jpg' 
WHERE title = 'Iced Matcha Latte';

UPDATE recipes 
SET image_url = '/images/hot-matcha-latte-hero.jpg' 
WHERE title = 'Hot Matcha Latte';

-- Verify updates
SELECT title, image_url FROM recipes WHERE title IN (
    'Strawberry Matcha Foam Latte',
    'Matcha Frappe', 
    'Iced Matcha Latte',
    'Hot Matcha Latte'
);
