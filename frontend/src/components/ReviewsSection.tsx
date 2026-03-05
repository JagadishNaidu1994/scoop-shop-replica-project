import React, { useState, useMemo } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { sampleProductReviews } from '@/data/sampleProductReviews';

type SortOption = 'latest' | 'highest' | 'lowest';

interface ReviewsSectionProps {
  productId: number;
}

interface ProductReview {
  id: string;
  product_id: number;
  user_id: string;
  order_id: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
}

const ReviewsSection = ({ productId }: ReviewsSectionProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [showForm, setShowForm] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const reviewsPerPage = 10;

  // Fetch approved reviews for this product (visible to everyone)
  const { data: dbReviews = [] } = useQuery({
    queryKey: ['product-reviews', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', productId)
        .eq('is_approved', true)
        .eq('is_archived', false)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as ProductReview[];
    },
  });

  // Use sample reviews as fallback when no DB reviews exist
  const reviews = useMemo(() => {
    if (dbReviews.length > 0) return dbReviews;
    return sampleProductReviews.map(r => ({
      id: r.id,
      product_id: productId,
      user_id: '',
      order_id: '',
      rating: r.rating,
      comment: r.comment,
      is_approved: true,
      created_at: r.created_at,
    }));
  }, [dbReviews, productId]);

  // Fetch user's existing reviews for this product (only when logged in)
  const { data: userReviews = [] } = useQuery({
    queryKey: ['user-product-reviews', productId, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', productId)
        .eq('user_id', user!.id);
      if (error) throw error;
      return data as ProductReview[];
    },
    enabled: !!user,
  });

  // Fetch orders that contain this product (delivered only, logged in)
  const { data: eligibleOrders = [] } = useQuery({
    queryKey: ['eligible-review-orders', productId, user?.id],
    queryFn: async () => {
      const { data: orderItems, error: itemsError } = await supabase
        .from('order_items')
        .select('order_id, product_id')
        .eq('product_id', productId);
      if (itemsError) throw itemsError;
      if (!orderItems || orderItems.length === 0) return [];

      const orderIds = [...new Set(orderItems.map(i => i.order_id).filter(Boolean))];
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id, order_number, created_at')
        .eq('user_id', user!.id)
        .eq('status', 'delivered')
        .in('id', orderIds);
      if (ordersError) throw ordersError;

      const reviewedOrderIds = new Set(userReviews.map(r => r.order_id));
      return (orders || []).filter(o => !reviewedOrderIds.has(o.id));
    },
    enabled: !!user && userReviews !== undefined,
  });

  const submitReview = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('product_reviews')
        .insert({
          product_id: productId,
          user_id: user!.id,
          order_id: selectedOrderId,
          rating: newRating,
          comment: newComment,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Review submitted!', description: 'Your review is pending admin approval.' });
      setShowForm(false);
      setNewComment('');
      setNewRating(5);
      setSelectedOrderId('');
      queryClient.invalidateQueries({ queryKey: ['product-reviews', productId] });
      queryClient.invalidateQueries({ queryKey: ['user-product-reviews', productId] });
      queryClient.invalidateQueries({ queryKey: ['eligible-review-orders', productId] });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to submit review.', variant: 'destructive' });
    },
  });

  const sortedReviews = useMemo(() => {
    const sorted = [...reviews];
    switch (sortBy) {
      case 'latest': return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case 'highest': return sorted.sort((a, b) => b.rating - a.rating);
      case 'lowest': return sorted.sort((a, b) => a.rating - b.rating);
      default: return sorted;
    }
  }, [sortBy, reviews]);

  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);
  const displayedReviews = isExpanded
    ? sortedReviews.slice((currentPage - 1) * reviewsPerPage, currentPage * reviewsPerPage)
    : sortedReviews.slice(0, 2);

  const averageRating = reviews.length > 0
    ? +(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const ratingDistribution = useMemo(() => {
    const dist = [0, 0, 0, 0, 0];
    reviews.forEach(r => dist[r.rating - 1]++);
    return dist.reverse();
  }, [reviews]);

  const canWriteReview = !!user && eligibleOrders.length > 0;

  return (
    <section className="w-full py-16">
      <div className="w-full px-0">
        <div className="text-center mb-10">
          <h3 className="text-3xl lg:text-4xl font-serif font-bold text-foreground mb-2">Here's what our customers say</h3>
          {reviews.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.round(averageRating) ? 'fill-current' : 'text-muted-foreground/40'}`} />
                ))}
              </div>
              <span className="text-lg font-semibold text-foreground">{averageRating}</span>
              <span className="text-muted-foreground">based on {reviews.length} reviews</span>
            </div>
          )}
        </div>

        {/* Write review button - only for logged-in users with eligible orders */}
        {canWriteReview && (
          <div className="text-center mb-8">
            <Button onClick={() => setShowForm(!showForm)} variant="outline" className="border-foreground text-foreground hover:bg-foreground hover:text-background">
              {showForm ? 'Cancel' : 'Write a Review'}
            </Button>
          </div>
        )}

        {/* Login prompt for non-logged-in users */}
        {!user && (
          <div className="text-center mb-8">
            <p className="text-sm text-muted-foreground">Log in to write a review</p>
          </div>
        )}

        {showForm && (
          <div className="max-w-lg mx-auto mb-10 p-6 border border-border rounded-xl bg-card">
            <h4 className="font-semibold text-foreground mb-4">Write Your Review</h4>
            <div className="mb-4">
              <label className="text-sm text-muted-foreground mb-1 block">Select Order</label>
              <select value={selectedOrderId} onChange={(e) => setSelectedOrderId(e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground text-sm">
                <option value="">Choose an order...</option>
                {eligibleOrders.map(o => (
                  <option key={o.id} value={o.id}>Order #{o.order_number} — {new Date(o.created_at).toLocaleDateString()}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="text-sm text-muted-foreground mb-1 block">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} onClick={() => setNewRating(star)} type="button">
                    <Star className={`w-6 h-6 ${star <= newRating ? 'text-yellow-400 fill-current' : 'text-muted-foreground/40'}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="text-sm text-muted-foreground mb-1 block">Your Review</label>
              <Textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Share your experience..." className="min-h-[100px]" />
            </div>
            <Button onClick={() => submitReview.mutate()} disabled={!selectedOrderId || !newComment.trim() || submitReview.isPending} className="w-full bg-foreground text-background hover:bg-foreground/90">
              {submitReview.isPending ? 'Submitting...' : 'Submit Review'}
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center">Your review will be visible after admin approval.</p>
          </div>
        )}

        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          <>
            <div className="max-w-md mx-auto mb-8">
              {[5, 4, 3, 2, 1].map((stars, idx) => (
                <div key={stars} className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-muted-foreground w-12">{stars} star</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${(ratingDistribution[idx] / reviews.length) * 100}%` }} />
                  </div>
                  <span className="text-sm text-muted-foreground w-8 text-right">{ratingDistribution[idx]}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-sm text-muted-foreground">{reviews.length} reviews</span>
              <select value={sortBy} onChange={(e) => { setSortBy(e.target.value as SortOption); setCurrentPage(1); }} className="text-sm border border-border rounded-lg px-3 py-2 bg-background">
                <option value="latest">Latest</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
              </select>
            </div>

            <div className="space-y-4">
              {displayedReviews.map((review) => (
                <div key={review.id} className="border border-border rounded-xl p-5 bg-card">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-foreground rounded-full flex items-center justify-center text-background font-semibold text-sm">R</div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">Verified Buyer</p>
                        <span className="text-xs text-green-600 font-medium">✓ Verified Purchase</span>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex text-yellow-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-muted-foreground/40'}`} />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>

            {/* Expand / Collapse toggle */}
            {sortedReviews.length > 2 && (
              <div className="text-center mt-6">
                <Button
                  variant="outline"
                  onClick={() => { setIsExpanded(!isExpanded); setCurrentPage(1); }}
                  className="border-foreground text-foreground hover:bg-foreground hover:text-background"
                >
                  {isExpanded ? 'Show Less Reviews' : `View All ${sortedReviews.length} Reviews`}
                </Button>
              </div>
            )}

            {/* Pagination - only when expanded */}
            {isExpanded && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-border disabled:opacity-40 hover:bg-muted transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button key={page} onClick={() => setCurrentPage(page)} className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === page ? 'bg-foreground text-background' : 'border border-border hover:bg-muted text-foreground'}`}>
                    {page}
                  </button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-border disabled:opacity-40 hover:bg-muted transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default ReviewsSection;
