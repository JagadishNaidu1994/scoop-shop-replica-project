-- Update product 2 with proper image URLs
UPDATE products 
SET 
  primary_image = '/lovable-uploads/18fa3a22-212e-489f-bdee-5bb2266db6a4.png',
  hover_image = '/lovable-uploads/26d45a3e-0bd4-4883-89d1-b11b087ead71.png'
WHERE id = 2;

-- Update product 3 with proper image URLs
UPDATE products 
SET 
  primary_image = '/lovable-uploads/34a12b18-2b53-4154-8791-a374723bc2f0.png',
  hover_image = '/lovable-uploads/362012c4-dfba-48a8-afca-59e8f36ec3cf.png'
WHERE id = 3;