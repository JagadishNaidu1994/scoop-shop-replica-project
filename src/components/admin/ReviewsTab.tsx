
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Placeholder Review interface that matches what would be expected
interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  archived: boolean;
  admin_reply?: string;
  is_important: boolean;
  admin_reply_date?: string;
  created_at: string;
  product_name?: string;
  user_email?: string;
}

const ReviewsTab = () => {
  // Placeholder data since reviews table doesn't exist
  const [loading] = useState(false);
  const reviews: Review[] = [];
  const archivedReviews: Review[] = [];

  return (
    <div>
      <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">Customer Reviews</h2>
      
      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Active Reviews ({reviews.length})</TabsTrigger>
          <TabsTrigger value="favorites">Favorites ({reviews.filter(r => r.is_important).length})</TabsTrigger>
          <TabsTrigger value="archived">Archived ({archivedReviews.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : reviews.length > 0 ? (
            reviews.map((review) => (
              <Card key={review.id} className="rounded-3xl bg-white/80 backdrop-blur-xl shadow-xl border-slate-200">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{review.product_name}</h3>
                      <p className="text-sm text-muted-foreground">{review.user_email}</p>
                      <div className="flex items-center mt-2">
                        <span className="text-sm">Rating: {review.rating}/5</span>
                        <Badge
                          className="ml-2 rounded-2xl"
                          variant={review.is_approved ? "default" : "secondary"}
                        >
                          {review.is_approved ? "Approved" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-sm">{review.comment}</p>
                  {review.admin_reply && (
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <h4 className="font-medium text-sm mb-2">Admin Reply:</h4>
                      <p className="text-sm">{review.admin_reply}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="rounded-3xl bg-white/80 backdrop-blur-xl shadow-xl border-slate-200">
              <CardHeader>
                <CardTitle className="text-xl bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">No Reviews System</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    The reviews system is not yet set up. To enable reviews, you would need to:
                  </p>
                  <div className="mt-4 text-left max-w-md mx-auto">
                    <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                      <li>Create a reviews table in the database</li>
                      <li>Set up proper relationships with products and users</li>
                      <li>Implement review submission functionality</li>
                      <li>Configure admin approval workflows</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="favorites" className="space-y-4">
          <Card className="rounded-3xl bg-white/80 backdrop-blur-xl shadow-xl border-slate-200">
            <CardHeader>
              <CardTitle className="text-xl bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Favorite Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-500">No favorite reviews found</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="archived" className="space-y-4">
          <Card className="rounded-3xl bg-white/80 backdrop-blur-xl shadow-xl border-slate-200">
            <CardHeader>
              <CardTitle className="text-xl bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Archived Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-gray-500">No archived reviews found</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReviewsTab;
