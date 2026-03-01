import React, { useState, useMemo } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { sampleReviews, averageRating, totalReviewCount, type ProductReview } from '@/data/sampleReviews75';

type SortOption = 'latest' | 'highest' | 'lowest';

const ReviewsSection = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const reviewsPerPage = 10;

  const sortedReviews = useMemo(() => {
    const sorted = [...sampleReviews];
    switch (sortBy) {
      case 'latest':
        return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case 'highest':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'lowest':
        return sorted.sort((a, b) => a.rating - b.rating);
      default:
        return sorted;
    }
  }, [sortBy]);

  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);
  const paginatedReviews = sortedReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  const ratingDistribution = useMemo(() => {
    const dist = [0, 0, 0, 0, 0];
    sampleReviews.forEach(r => dist[Math.round(r.rating) - 1]++);
    return dist.reverse(); // 5-star first
  }, []);

  return (
    <section className="w-full py-16">
      <div className="w-full px-0">
        {/* Header */}
        <div className="text-center mb-10">
          <h3 className="text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-2">
            Here's what our customers say
          </h3>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < Math.round(averageRating) ? 'fill-current' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-lg font-semibold text-gray-900">{averageRating}</span>
            <span className="text-gray-500">based on {totalReviewCount} reviews</span>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="max-w-md mx-auto mb-8">
          {[5, 4, 3, 2, 1].map((stars, idx) => (
            <div key={stars} className="flex items-center gap-2 mb-1">
              <span className="text-sm text-gray-600 w-12">{stars} star</span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{ width: `${(ratingDistribution[idx] / totalReviewCount) * 100}%` }}
                />
              </div>
              <span className="text-sm text-gray-500 w-8 text-right">{ratingDistribution[idx]}</span>
            </div>
          ))}
        </div>

        {/* Sort Controls */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm text-gray-600">{totalReviewCount} reviews</span>
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value as SortOption); setCurrentPage(1); }}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white"
          >
            <option value="latest">Latest</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>

        {/* Reviews Grid */}
        <div className="space-y-4">
          {paginatedReviews.map((review) => (
            <div key={review.id} className="border border-gray-200 rounded-xl p-5 bg-white">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{review.name}</p>
                    {review.verified && (
                      <span className="text-xs text-green-600 font-medium">✓ Verified Purchase</span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(review.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div className="flex text-yellow-400 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                ))}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                currentPage === page
                  ? 'bg-gray-900 text-white'
                  : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
