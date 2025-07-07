
export const addSampleOrderItems = async (supabase: any) => {
  // Sample order items for existing orders
  const sampleOrderItems = [
    // Items for order: 54df2ba7-84e7-46e2-b022-8ab6d548d813
    {
      order_id: '54df2ba7-84e7-46e2-b022-8ab6d548d813',
      product_id: 1,
      product_name: 'Micro Backpack',
      product_price: 70,
      quantity: 2
    },
    {
      order_id: '54df2ba7-84e7-46e2-b022-8ab6d548d813',
      product_id: 2,
      product_name: 'Nomad Shopping Tote',
      product_price: 120,
      quantity: 1
    },
    // Items for order: 51a0d417-40f6-44a2-8593-3429dbc299ad
    {
      order_id: '51a0d417-40f6-44a2-8593-3429dbc299ad',
      product_id: 1,
      product_name: 'Micro Backpack',
      product_price: 25,
      quantity: 1
    },
    // Items for order: b5698048-83c7-4e5d-a83c-631c0f6de842
    {
      order_id: 'b5698048-83c7-4e5d-a83c-631c0f6de842',
      product_id: 3,
      product_name: 'Double Stack Clothing Bag',
      product_price: 50,
      quantity: 2
    }
  ];

  try {
    const { error } = await supabase
      .from('order_items')
      .insert(sampleOrderItems);
    
    if (error) {
      console.error('Error adding sample order items:', error);
    } else {
      console.log('Sample order items added successfully');
    }
  } catch (error) {
    console.error('Error adding sample order items:', error);
  }
};
