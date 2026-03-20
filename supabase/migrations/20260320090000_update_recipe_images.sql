-- Update recipe images for specific recipes
-- These paths should be updated with the actual uploaded image paths

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
