const firstNames = [
  "Aarav", "Priya", "Rohan", "Ananya", "Vikram", "Meera", "Arjun", "Sneha", "Karthik", "Divya",
  "Rahul", "Pooja", "Siddharth", "Neha", "Aditya", "Kavya", "Varun", "Ishita", "Nishant", "Shruti",
  "Amit", "Riya", "Manish", "Tanvi", "Rajesh", "Swati", "Suresh", "Aditi", "Kunal", "Bhavna",
  "Harsh", "Simran", "Deepak", "Anjali", "Gaurav", "Pallavi", "Vivek", "Preeti", "Ashish", "Megha",
  "Nikhil", "Ritika", "Sachin", "Sakshi", "Tushar", "Nidhi", "Akash", "Tanya", "Mohit", "Sonal",
  "Pranav", "Kriti", "Jayesh", "Aisha", "Sanjay", "Lavanya", "Ramesh", "Trisha", "Ajay", "Diya",
  "Himanshu", "Isha", "Pankaj", "Komal", "Tarun", "Madhuri", "Rohit", "Saumya", "Vishal", "Rupal",
  "Yash", "Anisha", "Dhruv", "Jaya", "Manoj"
];

const comments5Star = [
  "This matcha is absolutely incredible! The taste is smooth and the energy boost lasts all day.",
  "Best matcha I've ever had. The quality is unmatched and it mixes so well.",
  "I'm obsessed! Replaced my morning coffee and feel so much better throughout the day.",
  "The ceremonial grade quality really shows. Smooth, no bitterness at all.",
  "My skin has been glowing since I started drinking this daily. Highly recommend!",
  "Perfect for iced lattes. The color is vibrant and the taste is clean.",
  "I've tried many matcha brands but NASTEA is on another level. Truly premium.",
  "The focus I get from this is amazing. No jitters, just calm energy.",
  "Bought this as a gift and now my whole family is hooked!",
  "Subscription is a game-changer. Fresh matcha delivered right to my door.",
  "The packaging is beautiful and the matcha inside is even better.",
  "I can actually taste the difference between this and supermarket matcha. Worth every rupee.",
  "My morning ritual has completely transformed. This matcha is everything.",
  "Hyderabad's finest! So proud to support a local matcha brand.",
  "The Lion's Mane blend is incredible for studying. My focus is next level.",
  "Been drinking this for 3 months and my energy levels have never been more consistent.",
  "Love that it's organic and certified. Finally a brand I can trust.",
  "Perfect latte every time. Even my non-matcha friends love it.",
  "The subtle sweetness and umami flavor is perfection in a cup.",
  "Customer service is amazing too. They helped me pick the right blend.",
];

const comments4Star = [
  "Really good matcha, just wish the packaging was resealable. The taste is excellent though.",
  "Great quality matcha. Slightly pricey but you get what you pay for.",
  "Love the taste and energy. Delivery took a day longer than expected but worth the wait.",
  "Smooth and delicious. Would love more flavor options in the future.",
  "Very good ceremonial grade. A tiny bit of settling at the bottom but overall great.",
  "Nice matcha for daily use. The subscription discount makes it very reasonable.",
  "Good energy boost without the crash. Prefer it iced over hot.",
  "Quality is clearly premium. Would rate 5 stars if shipping was faster to my city.",
  "My second order and still impressed. The consistency is great batch to batch.",
  "Excellent for lattes. Would love a smaller trial size for gifting.",
  "Great taste and smooth texture. The bamboo whisk recommendation really helped.",
  "Solid matcha. The color is beautiful green. Takes a bit to dissolve in cold milk.",
  "Really enjoying this as my daily ritual. Good value for ceremonial grade.",
  "Nice product, good packaging. Would appreciate more recipe suggestions included.",
  "Impressed with the quality. Slightly less vibrant than expected but tastes wonderful.",
];

const comments3Star = [
  "Decent matcha. The taste is good but I expected a bit more vibrancy in color.",
  "It's okay, not bad but not the best I've had. Fair price for the quality.",
  "Average matcha experience. Good for lattes but not quite ceremonial sipping quality for me.",
  "The matcha is fine. Took some getting used to but I appreciate the clean energy.",
  "Mixed feelings. Great on some days, a bit bitter on others. Maybe my technique.",
];

const generateDate = (index: number): string => {
  const now = new Date();
  const daysAgo = Math.floor(index * 4.5) + Math.floor(Math.random() * 3);
  const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  return date.toISOString();
};

export interface ProductReview {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export const sampleReviews: ProductReview[] = Array.from({ length: 75 }, (_, i) => {
  let rating: number;
  let comment: string;

  if (i < 45) {
    rating = 5;
    comment = comments5Star[i % comments5Star.length];
  } else if (i < 65) {
    rating = 4;
    comment = comments4Star[(i - 45) % comments4Star.length];
  } else {
    rating = 3;
    comment = comments3Star[(i - 65) % comments3Star.length];
  }

  return {
    id: `review-${i + 1}`,
    name: firstNames[i % firstNames.length],
    rating,
    comment,
    date: generateDate(i),
    verified: Math.random() > 0.15,
  };
});

export const averageRating = +(sampleReviews.reduce((sum, r) => sum + r.rating, 0) / sampleReviews.length).toFixed(1);
export const totalReviewCount = sampleReviews.length;
