export interface ProductReview {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

const reviewsRaw: { rating: number; comment: string }[] = [
  // 2 × 1.9
  { rating: 1.9, comment: "Not saying it changed my life, but it definitely improved my mornings." },
  { rating: 1.9, comment: "Mixed feelings. Great on some days, a bit bitter on others. Maybe my technique." },
  // 2 × 2.9
  { rating: 2.9, comment: "Decent matcha. The taste is good but I expected a bit more vibrancy in color." },
  { rating: 2.9, comment: "It's okay, not bad but not the best I've had. Fair price for the quality." },
  // 2 × 3.9
  { rating: 3.9, comment: "Average matcha experience. Good for lattes but not quite ceremonial sipping quality for me." },
  { rating: 3.9, comment: "The matcha is fine. Took some getting used to but I appreciate the clean energy." },
  // 2 × 4.9
  { rating: 4.9, comment: "Finally found a matcha that doesn't taste like grass. Smooth, bright, and actually easy to drink every day." },
  { rating: 4.9, comment: "The colour is what got me first, but the taste is what made me reorder. Very clean and not bitter." },
  // 20 × 4.7
  { rating: 4.7, comment: "I switched this in for my usual coffee a few mornings a week and it feels like a calmer start for me." },
  { rating: 4.7, comment: "This is the first matcha I've bought that still tastes good with oat milk." },
  { rating: 4.7, comment: "Tried it iced first and now I'm having it almost every afternoon. Proper smooth." },
  { rating: 4.7, comment: "I bought it for the aesthetic, fully expected to hate the taste, and now I'm annoyingly into it." },
  { rating: 4.7, comment: "Whisks really well. No weird clumps, no swampy finish, just a nice clean cup." },
  { rating: 4.7, comment: "The Japanese Classic is perfect for lattes. Strong enough to show up in milk without going harsh." },
  { rating: 4.7, comment: "Packaging is beautiful, but thankfully the matcha inside actually lives up to it." },
  { rating: 4.7, comment: "I'm pretty picky with matcha and this one tastes way fresher than most I've tried in India." },
  { rating: 4.7, comment: "The ceremonial one is genuinely smooth enough to drink straight. Didn't expect that." },
  { rating: 4.7, comment: "I like that it feels premium without being intimidating. Easy to make, easy to enjoy." },
  { rating: 4.7, comment: "This has officially replaced my expensive café order." },
  { rating: 4.7, comment: "I've tried a lot of 'ceremonial' matcha that turned dull in milk. This one doesn't." },
  { rating: 4.7, comment: "Very vibrant green and the taste is softer than I expected. Good sign." },
  { rating: 4.7, comment: "No sugar, no extras, just a really solid matcha. That's exactly what I wanted." },
  { rating: 4.7, comment: "Feels like one of those products where you can tell they cared about the details." },
  { rating: 4.7, comment: "Not too grassy, not too sweet, not too flat. Nice balance." },
  { rating: 4.7, comment: "I was nervous it would be overhyped, but it's actually lovely." },
  { rating: 4.7, comment: "Made an iced strawberry matcha with this and it was elite." },
  { rating: 4.7, comment: "The smell when you open the tin already tells you it's a good one." },
  { rating: 4.7, comment: "I appreciate that it tastes premium but still works for daily use." },
  // 20 × 4.8
  { rating: 4.8, comment: "The ceremonial grade feels like a treat. The classic feels like a habit. Both are good." },
  { rating: 4.8, comment: "Creamy texture, bright colour, no bitter aftertaste. Ticks all my boxes." },
  { rating: 4.8, comment: "I've started carrying a small whisk to work because of this. Slightly embarrassing, worth it." },
  { rating: 4.8, comment: "It's beginner-friendly, which I mean as a compliment." },
  { rating: 4.8, comment: "The finish is really clean. That's the bit that surprised me most." },
  { rating: 4.8, comment: "Feels more premium than a lot of imported ones I've tried." },
  { rating: 4.8, comment: "I usually need honey in matcha but didn't feel like I had to with this." },
  { rating: 4.8, comment: "Good enough to serve to friends and not panic." },
  { rating: 4.8, comment: "The classic grade is now my 4pm reset drink." },
  { rating: 4.8, comment: "It looks camera-ready, which sounds silly, but it matters when the drink also tastes good." },
  { rating: 4.8, comment: "Very smooth with coconut milk, which is not always the case." },
  { rating: 4.8, comment: "I like that it still feels luxe even in a simple iced latte." },
  { rating: 4.8, comment: "Tastes fresh and not dusty, if that makes sense." },
  { rating: 4.8, comment: "One of the few matchas I've had where the second sip is even better than the first." },
  { rating: 4.8, comment: "The powder is super fine, so it mixes much more easily than cheaper brands." },
  { rating: 4.8, comment: "I didn't realise how much batch variation I was tolerating until I tried this." },
  { rating: 4.8, comment: "This is what I wanted matcha to taste like when I first got into it." },
  { rating: 4.8, comment: "The daily latte grade is genuinely useful. Nice to see honest positioning." },
  { rating: 4.8, comment: "I've been trying to cut down on coffee and this has made it much easier." },
  { rating: 4.8, comment: "Smooth enough for a straight whisked cup, forgiving enough for lazy latte days." },
  // 20 × 4.9
  { rating: 4.9, comment: "The colour stays bright even over ice, which I weirdly love." },
  { rating: 4.9, comment: "This tastes expensive in the best way." },
  { rating: 4.9, comment: "I'm normally sceptical of wellness brands, but the product quality here feels legit." },
  { rating: 4.9, comment: "The matcha itself is excellent and the brand feels considered, not generic." },
  { rating: 4.9, comment: "Bought it as a gift, ended up keeping one for myself." },
  { rating: 4.9, comment: "Really nice umami note without getting too intense." },
  { rating: 4.9, comment: "It's become part of my weekday routine without me forcing it." },
  { rating: 4.9, comment: "The classic one is ideal if you like stronger lattes." },
  { rating: 4.9, comment: "Ceremonial grade is silky. That's the word." },
  { rating: 4.9, comment: "My partner, who usually hates matcha, actually liked this." },
  { rating: 4.9, comment: "Honestly just relieved to find a matcha that isn't all packaging and no substance." },
  { rating: 4.9, comment: "A lot of brands call themselves premium. This one at least tastes like it." },
  { rating: 4.9, comment: "The texture is excellent and the flavour is more rounded than I expected." },
  { rating: 4.9, comment: "I keep reaching for this over coffee on work-from-home days." },
  { rating: 4.9, comment: "Very good quality for something I can actually use daily." },
  { rating: 4.9, comment: "This made me realise I don't actually dislike matcha. I disliked bad matcha." },
  { rating: 4.9, comment: "Easy reorder for me." },
  { rating: 4.9, comment: "Delivery was quick, packaging was neat, and the product itself felt premium." },
  { rating: 4.9, comment: "The whisking experience is weirdly satisfying because it froths so nicely." },
  { rating: 4.9, comment: "Good for people who want a smoother entry into matcha." },
  // 11 × 5.0
  { rating: 5.0, comment: "The first pouch disappeared faster than expected in this house." },
  { rating: 5.0, comment: "I've tried it hot, iced, and in a tonic. Surprisingly versatile." },
  { rating: 5.0, comment: "The ceremonial grade is probably my favourite for weekends when I want the full ritual." },
  { rating: 5.0, comment: "The classic is the one I'd keep on subscription if you ever do that." },
  { rating: 5.0, comment: "Lovely bright green, very fresh taste, and no chalky mouthfeel." },
  { rating: 5.0, comment: "This is the first Indian-available matcha I'd confidently recommend to a friend." },
  { rating: 5.0, comment: "Not cheap, but it tastes like the price makes sense." },
  { rating: 5.0, comment: "I like that the product feels premium without being overly precious." },
  { rating: 5.0, comment: "Would especially recommend this if you're tired of bitter matcha." },
  { rating: 5.0, comment: "The aftertaste is much cleaner than the last brand I tried." },
  { rating: 5.0, comment: "Looks good, tastes good, and actually works in recipes too." },
];

const generateDate = (index: number): string => {
  const now = new Date();
  const daysAgo = Math.floor(index * 3.5) + Math.floor(Math.random() * 5);
  const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  return date.toISOString();
};

export const sampleReviews: ProductReview[] = reviewsRaw.map((r, i) => ({
  id: `review-${i + 1}`,
  name: "Anonymous",
  rating: r.rating,
  comment: r.comment,
  date: generateDate(i),
  verified: Math.random() > 0.1,
}));

export const averageRating = +(sampleReviews.reduce((sum, r) => sum + r.rating, 0) / sampleReviews.length).toFixed(1);
export const totalReviewCount = sampleReviews.length;
