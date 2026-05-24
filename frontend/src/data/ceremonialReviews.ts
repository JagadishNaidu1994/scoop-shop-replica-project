
export interface SampleReview {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  product_id: number;
}

// Ceremonial Matcha Reviews - 40% of 79 reviews = 32 reviews
const comments: string[] = [
  "The ceremonial one is genuinely smooth enough to drink straight. Didn't expect that.",
  "The ceremonial grade feels like a treat. The classic feels like a habit. Both are good.",
  "Creamy texture, bright colour, no bitter aftertaste. Ticks all my boxes.",
  "The finish is really clean. That's the bit that surprised me most.",
  "It looks camera-ready, which sounds silly, but it matters when the drink also tastes good.",
  "One of the few matchas I've had where the second sip is even better than the first.",
  "The colour is what got me first, but the taste is what made me reorder. Very clean and not bitter.",
  "I usually need honey in matcha but didn't feel like I had to with this.",
  "I like that it still feels luxe even in a simple iced latte.",
  "Really nice umami note without getting too intense.",
  "Very good quality for something I can actually use daily.",
  "Ceremonial grade is silky. That's the word.",
  "The texture is excellent and the flavour is more rounded than I expected.",
  "The ceremonial grade is probably my favourite for weekends when I want the full ritual.",
  "Lovely bright green, very fresh taste, and no chalky mouthfeel.",
  "Would especially recommend this if you're tired of bitter matcha.",
  "Not saying it changed my life, but it definitely improved my mornings.",
  "Smooth enough for a straight whisked cup, forgiving enough for lazy latte days.",
  "This tastes expensive in the best way.",
  "I'm normally sceptical of wellness brands, but the product quality here feels legit.",
  "The matcha itself is excellent and the brand feels considered, not generic.",
  "Bought it as a gift, ended up keeping one for myself.",
  "Honestly just relieved to find a matcha that isn't all packaging and no substance.",
  "A lot of brands call themselves premium. This one at least tastes like it.",
  "Feels more premium than a lot of imported ones I've tried.",
  "Very vibrant green and the taste is softer than I expected. Good sign.",
  "I've tried a lot of 'ceremonial' matcha that turned dull in milk. This one doesn't.",
  "The smell when you open the tin already tells you it's a good one.",
  "I appreciate that it tastes premium but still works for daily use.",
  "Good enough to serve to friends and not panic.",
  "Very solid first experience. I'd happily buy again.",
  "Feels like a brand that understands both product quality and how people actually drink matcha.",
];

// Rating distribution for ceremonial: 32 reviews mostly 5 stars (quality product)
const ratings = [
  5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
  5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
  5, 5, 5, 5, 5, 4, 4, 4, 4, 4,
  4, 4,
];

// Generate dates randomly between April 20, 2026 and May 24, 2026
function generateDate(index: number): string {
  const startDate = new Date('2026-04-20');
  const endDate = new Date('2026-05-24');
  const randomTime = Math.random() * (endDate.getTime() - startDate.getTime());
  const d = new Date(startDate.getTime() + randomTime);
  return d.toISOString();
}

export const ceremonialReviews: SampleReview[] = comments.map((comment, i) => ({
  id: `ceremonial-review-${i + 1}`,
  rating: ratings[i],
  comment,
  created_at: generateDate(i),
  product_id: 1,
}));
