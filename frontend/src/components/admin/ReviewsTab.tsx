import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { Star, Check, X, Archive, StarIcon } from "lucide-react";

interface Review {
  id: string;
  product_id: number;
  user_id: string;
  order_id: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  is_archived: boolean;
  is_important: boolean;
  admin_reply: string | null;
  admin_reply_date: string | null;
  created_at: string;
}

const ReviewsTab = () => {
  const queryClient = useQueryClient();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const { data: allReviews = [], isLoading } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_reviews')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Review[];
    },
  });

  const pendingReviews = allReviews.filter(r => !r.is_approved && !r.is_archived);
  const approvedReviews = allReviews.filter(r => r.is_approved && !r.is_archived);
  const archivedReviews = allReviews.filter(r => r.is_archived);
  const importantReviews = allReviews.filter(r => r.is_important && !r.is_archived);

  const updateReview = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Record<string, unknown> }) => {
      const { error } = await supabase
        .from('product_reviews')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] });
      toast({ title: 'Review updated' });
    },
    onError: () => {
      toast({ title: 'Error updating review', variant: 'destructive' });
    },
  });

  const handleApprove = (id: string) => updateReview.mutate({ id, updates: { is_approved: true } });
  const handleReject = (id: string) => updateReview.mutate({ id, updates: { is_approved: false, is_archived: true } });
  const handleArchive = (id: string) => updateReview.mutate({ id, updates: { is_archived: true } });
  const handleUnarchive = (id: string) => updateReview.mutate({ id, updates: { is_archived: false } });
  const handleToggleImportant = (id: string, current: boolean) => updateReview.mutate({ id, updates: { is_important: !current } });
  
  const handleReply = (id: string) => {
    if (!replyText.trim()) return;
    updateReview.mutate({ id, updates: { admin_reply: replyText, admin_reply_date: new Date().toISOString() } });
    setReplyingTo(null);
    setReplyText('');
  };

  const renderReview = (review: Review, showActions = true) => (
    <Card key={review.id} className="rounded-3xl bg-white/80 backdrop-blur-xl shadow-xl border-slate-200">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground">Product ID: {review.product_id}</p>
            <div className="flex items-center mt-1 gap-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                ))}
              </div>
              <Badge className="rounded-2xl" variant={review.is_approved ? "default" : "secondary"}>
                {review.is_approved ? "Approved" : "Pending"}
              </Badge>
              {review.is_important && (
                <Badge className="rounded-2xl bg-yellow-100 text-yellow-800">★ Important</Badge>
              )}
            </div>
          </div>
          <span className="text-xs text-muted-foreground">
            {new Date(review.created_at).toLocaleDateString()}
          </span>
        </div>
        <p className="mt-3 text-sm">{review.comment}</p>

        {review.admin_reply && (
          <div className="mt-3 p-3 bg-muted rounded-lg">
            <p className="font-medium text-xs mb-1">Admin Reply:</p>
            <p className="text-sm">{review.admin_reply}</p>
          </div>
        )}

        {showActions && (
          <div className="flex flex-wrap gap-2 mt-4">
            {!review.is_approved && !review.is_archived && (
              <>
                <Button size="sm" variant="default" onClick={() => handleApprove(review.id)}>
                  <Check className="w-3 h-3 mr-1" /> Approve
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleReject(review.id)}>
                  <X className="w-3 h-3 mr-1" /> Reject
                </Button>
              </>
            )}
            {!review.is_archived && (
              <>
                <Button size="sm" variant="outline" onClick={() => handleArchive(review.id)}>
                  <Archive className="w-3 h-3 mr-1" /> Archive
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleToggleImportant(review.id, review.is_important)}>
                  <StarIcon className={`w-3 h-3 mr-1 ${review.is_important ? 'fill-current text-yellow-500' : ''}`} />
                  {review.is_important ? 'Unmark' : 'Mark Important'}
                </Button>
                <Button size="sm" variant="outline" onClick={() => { setReplyingTo(replyingTo === review.id ? null : review.id); setReplyText(review.admin_reply || ''); }}>
                  Reply
                </Button>
              </>
            )}
            {review.is_archived && (
              <Button size="sm" variant="outline" onClick={() => handleUnarchive(review.id)}>
                Unarchive
              </Button>
            )}
          </div>
        )}

        {replyingTo === review.id && (
          <div className="mt-3 space-y-2">
            <Textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Write admin reply..." />
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleReply(review.id)}>Save Reply</Button>
              <Button size="sm" variant="ghost" onClick={() => setReplyingTo(null)}>Cancel</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div>
      <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">Customer Reviews</h2>
      
      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingReviews.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedReviews.length})</TabsTrigger>
          <TabsTrigger value="important">Important ({importantReviews.length})</TabsTrigger>
          <TabsTrigger value="archived">Archived ({archivedReviews.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="space-y-4">
          {isLoading ? (
            <p className="text-center py-8 text-muted-foreground">Loading...</p>
          ) : pendingReviews.length > 0 ? (
            pendingReviews.map(r => renderReview(r))
          ) : (
            <Card className="rounded-3xl"><CardContent className="p-8 text-center text-muted-foreground">No pending reviews</CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {approvedReviews.length > 0 ? approvedReviews.map(r => renderReview(r)) : (
            <Card className="rounded-3xl"><CardContent className="p-8 text-center text-muted-foreground">No approved reviews</CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="important" className="space-y-4">
          {importantReviews.length > 0 ? importantReviews.map(r => renderReview(r)) : (
            <Card className="rounded-3xl"><CardContent className="p-8 text-center text-muted-foreground">No important reviews</CardContent></Card>
          )}
        </TabsContent>

        <TabsContent value="archived" className="space-y-4">
          {archivedReviews.length > 0 ? archivedReviews.map(r => renderReview(r)) : (
            <Card className="rounded-3xl"><CardContent className="p-8 text-center text-muted-foreground">No archived reviews</CardContent></Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReviewsTab;
