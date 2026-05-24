
export interface SampleReview {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  product_id: number;
}

// Japanese Classic Matcha Reviews - 60% of 79 reviews = 47 reviews
const comments: string[] = [
  "Finally found a matcha that doesn't taste like grass. Smooth, bright, and actually easy to drink every day.",
  "I switched this in for my usual coffee a few mornings a week and it feels like a calmer start for me.",
  "This is the first matcha I've bought that still tastes good with oat milk.",
  "Tried it iced first and now I'm having it almost every afternoon. Proper smooth.",
  "I bought it for the aesthetic, fully expected to hate the taste, and now I'm annoyingly into it.",
  "Whisks really well. No weird clumps, no swampy finish, just a nice clean cup.",
  "The Japanese Classic is perfect for lattes. Strong enough to show up in milk without going harsh.",
  "Packaging is beautiful, but thankfully the matcha inside actually lives up to it.",
  "I'm pretty picky with matcha and this one tastes way fresher than most I've tried in India.",
  "I like that it feels premium without being intimidating. Easy to make, easy to enjoy.",
  "This has officially replaced my expensive café order.",
  "Not too grassy, not too sweet, not too flat. Nice balance.",
  "I was nervous it would be overhyped, but it's actually lovely.",
  "Made an iced strawberry matcha with this and it was elite.",
  "I appreciate that it tastes premium but still works for daily use.",
  "I've started carrying a small whisk to work because of this. Slightly embarrassing, worth it.",
  "It's beginner-friendly, which I mean as a compliment.",
  "The powder is super fine, so it mixes much more easily than cheaper brands.",
  "I didn't realise how much batch variation I was tolerating until I tried this.",
  "This is what I wanted matcha to taste like when I first got into it.",
  "The daily latte grade is genuinely useful. Nice to see honest positioning.",
  "I've been trying to cut down on coffee and this has made it much easier.",
  "The colour stays bright even over ice, which I weirdly love.",
  "It's become part of my weekday routine without me forcing it.",
  "The classic one is ideal if you like stronger lattes.",
  "My partner, who usually hates matcha, actually liked this.",
  "This made me realise I don't actually dislike matcha. I disliked bad matcha.",
  "Easy reorder for me.",
  "Delivery was quick, packaging was neat, and the product itself felt premium.",
  "The whisking experience is weirdly satisfying because it froths so nicely.",
  "Good for people who want a smoother entry into matcha.",
  "The first pouch disappeared faster than expected in this house.",
  "I've tried it hot, iced, and in a tonic. Surprisingly versatile.",
  "The classic is the one I'd keep on subscription if you ever do that.",
  "This is the first Indian-available matcha I'd confidently recommend to a friend.",
  "Not cheap, but it tastes like the price makes sense.",
  "I like that the product feels premium without being overly precious.",
  "The aftertaste is much cleaner than the last brand I tried.",
  "Looks good, tastes good, and actually works in recipes too.",
  "I made a cheesecake with the culinary grade and the colour held beautifully.",
  "The classic pouch is my favourite balance of quality and everyday use.",
  "This has become my go-to when I want something a bit more put together than coffee.",
  "Very smooth with coconut milk, which is not always the case.",
  "Tastes fresh and not dusty, if that makes sense.",
  "No sugar, no extras, just a really solid matcha. That's exactly what I wanted.",
  "Feels like one of those products where you can tell they cared about the details.",
  "Very solid first experience. I'd happily buy again.",
];

// Rating distribution for Japanese Classic: 47 reviews with good mix of ratings
const ratings = [
  2, 2,
  3, 3,
  4, 4, 4,
  5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
  5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
  5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
  5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
  5, 5,
];

// Generate dates randomly between April 20, 2026 and May 24, 2026
function generateDate(index: number): string {
  const startDate = new Date('2026-04-20');
  const endDate = new Date('2026-05-24');
  const randomTime = Math.random() * (endDate.getTime() - startDate.getTime());
  const d = new Date(startDate.getTime() + randomTime);
  return d.toISOString();
}

export const japaneseClassicReviews: SampleReview[] = comments.map((comment, i) => ({
  id: `japanese-classic-review-${i + 1}`,
  rating: ratings[i],
  comment,
  created_at: generateDate(i),
  product_id: 2,
}));
