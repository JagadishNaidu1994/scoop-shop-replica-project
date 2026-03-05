
export interface SampleReview {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
}

// Rating distribution: 2×2, 2×3, 2×4, 73×5 = 79 reviews
const comments: string[] = [
  "Finally found a matcha that doesn't taste like grass. Smooth, bright, and actually easy to drink every day.",
  "The colour is what got me first, but the taste is what made me reorder. Very clean and not bitter.",
  "I switched this in for my usual coffee a few mornings a week and it feels like a calmer start for me.",
  "This is the first matcha I've bought that still tastes good with oat milk.",
  "Tried it iced first and now I'm having it almost every afternoon. Proper smooth.",
  "I bought it for the aesthetic, fully expected to hate the taste, and now I'm annoyingly into it.",
  "Whisks really well. No weird clumps, no swampy finish, just a nice clean cup.",
  "The Japanese Classic is perfect for lattes. Strong enough to show up in milk without going harsh.",
  "Packaging is beautiful, but thankfully the matcha inside actually lives up to it.",
  "I'm pretty picky with matcha and this one tastes way fresher than most I've tried in India.",
  "The ceremonial one is genuinely smooth enough to drink straight. Didn't expect that.",
  "I like that it feels premium without being intimidating. Easy to make, easy to enjoy.",
  "This has officially replaced my expensive café order.",
  "I've tried a lot of 'ceremonial' matcha that turned dull in milk. This one doesn't.",
  "Very vibrant green and the taste is softer than I expected. Good sign.",
  "No sugar, no extras, just a really solid matcha. That's exactly what I wanted.",
  "Feels like one of those products where you can tell they cared about the details.",
  "Not too grassy, not too sweet, not too flat. Nice balance.",
  "I was nervous it would be overhyped, but it's actually lovely.",
  "Made an iced strawberry matcha with this and it was elite.",
  "The smell when you open the tin already tells you it's a good one.",
  "I appreciate that it tastes premium but still works for daily use.",
  "The ceremonial grade feels like a treat. The classic feels like a habit. Both are good.",
  "Creamy texture, bright colour, no bitter aftertaste. Ticks all my boxes.",
  "I've started carrying a small whisk to work because of this. Slightly embarrassing, worth it.",
  "It's beginner-friendly, which I mean as a compliment.",
  "The finish is really clean. That's the bit that surprised me most.",
  "Feels more premium than a lot of imported ones I've tried.",
  "I usually need honey in matcha but didn't feel like I had to with this.",
  "Good enough to serve to friends and not panic.",
  "The classic grade is now my 4pm reset drink.",
  "It looks camera-ready, which sounds silly, but it matters when the drink also tastes good.",
  "Very smooth with coconut milk, which is not always the case.",
  "I like that it still feels luxe even in a simple iced latte.",
  "Tastes fresh and not dusty, if that makes sense.",
  "One of the few matchas I've had where the second sip is even better than the first.",
  "The powder is super fine, so it mixes much more easily than cheaper brands.",
  "I didn't realise how much batch variation I was tolerating until I tried this.",
  "This is what I wanted matcha to taste like when I first got into it.",
  "The daily latte grade is genuinely useful. Nice to see honest positioning.",
  "I've been trying to cut down on coffee and this has made it much easier.",
  "Not saying it changed my life, but it definitely improved my mornings.",
  "Smooth enough for a straight whisked cup, forgiving enough for lazy latte days.",
  "The colour stays bright even over ice, which I weirdly love.",
  "This tastes expensive in the best way.",
  "I'm normally sceptical of wellness brands, but the product quality here feels legit.",
  "The matcha itself is excellent and the brand feels considered, not generic.",
  "Bought it as a gift, ended up keeping one for myself.",
  "Really nice umami note without getting too intense.",
  "It's become part of my weekday routine without me forcing it.",
  "The classic one is ideal if you like stronger lattes.",
  "Ceremonial grade is silky. That's the word.",
  "My partner, who usually hates matcha, actually liked this.",
  "Honestly just relieved to find a matcha that isn't all packaging and no substance.",
  "A lot of brands call themselves premium. This one at least tastes like it.",
  "The texture is excellent and the flavour is more rounded than I expected.",
  "I keep reaching for this over coffee on work-from-home days.",
  "Very good quality for something I can actually use daily.",
  "This made me realise I don't actually dislike matcha. I disliked bad matcha.",
  "Easy reorder for me.",
  "Delivery was quick, packaging was neat, and the product itself felt premium.",
  "The whisking experience is weirdly satisfying because it froths so nicely.",
  "Good for people who want a smoother entry into matcha.",
  "The first pouch disappeared faster than expected in this house.",
  "I've tried it hot, iced, and in a tonic. Surprisingly versatile.",
  "The ceremonial grade is probably my favourite for weekends when I want the full ritual.",
  "The classic is the one I'd keep on subscription if you ever do that.",
  "Lovely bright green, very fresh taste, and no chalky mouthfeel.",
  "This is the first Indian-available matcha I'd confidently recommend to a friend.",
  "Not cheap, but it tastes like the price makes sense.",
  "I like that the product feels premium without being overly precious.",
  "Would especially recommend this if you're tired of bitter matcha.",
  "The aftertaste is much cleaner than the last brand I tried.",
  "Looks good, tastes good, and actually works in recipes too.",
  "I made a cheesecake with the culinary grade and the colour held beautifully.",
  "The classic pouch is my favourite balance of quality and everyday use.",
  "This has become my go-to when I want something a bit more put together than coffee.",
  "Feels like a brand that understands both product quality and how people actually drink matcha.",
  "Very solid first experience. I'd happily buy again.",
];

// Assign ratings: first 2 = 2, next 2 = 3, next 2 = 4, rest = 5
const ratings = [
  2, 2,
  3, 3,
  4, 4,
  5, 5,
  ...Array(20).fill(5),
  ...Array(20).fill(5),
  ...Array(20).fill(5),
  ...Array(11).fill(5),
];

// Generate dates spread over the last 6 months
function generateDate(index: number): string {
  const now = new Date('2026-03-01');
  const daysAgo = Math.floor((index / comments.length) * 180);
  const d = new Date(now);
  d.setDate(d.getDate() - (180 - daysAgo));
  return d.toISOString();
}

export const sampleProductReviews: SampleReview[] = comments.map((comment, i) => ({
  id: `sample-${i + 1}`,
  rating: ratings[i],
  comment,
  created_at: generateDate(i),
}));
