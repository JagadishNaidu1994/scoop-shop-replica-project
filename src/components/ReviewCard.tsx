
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { FaStar, FaReply } from "react-icons/fa";

interface Review {
  id: string;
  product_id?: string;
  user_id?: string;
  rating: number;
  comment: string;
  is_approved?: boolean;
  archived?: boolean;
  admin_reply?: string;
  is_important?: boolean;
  admin_reply_date?: string;
  created_at: string;
  product_name?: string;
  user_email?: string;
}

interface ReviewCardProps {
  review: Review;
  userEmail?: string;
  onReplySubmitted?: () => void;
  showAdminActions?: boolean;
}

const ReviewCard = ({ review, userEmail, onReplySubmitted, showAdminActions }: ReviewCardProps) => {
  const [replyText, setReplyText] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReplySubmit = () => {
    // Placeholder implementation
    console.log("Reply submitted:", replyText);
    setReplyText("");
    setShowReplyForm(false);
    if (onReplySubmitted) {
      onReplySubmitted();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">{review.product_name || "Product"}</h3>
            <p className="text-sm text-muted-foreground">{userEmail || review.user_email || "Customer"}</p>
            <div className="flex items-center mt-1">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`w-4 h-4 ${
                    i < review.rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {review.rating}/5
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {review.is_approved !== undefined && (
              <Badge variant={review.is_approved ? "default" : "secondary"}>
                {review.is_approved ? "Approved" : "Pending"}
              </Badge>
            )}
            {review.is_important && (
              <Badge variant="destructive">Important</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4">{review.comment}</p>
        
        {review.admin_reply && (
          <div className="bg-muted p-3 rounded-lg mb-4">
            <h4 className="font-medium text-sm mb-2">Admin Reply:</h4>
            <p className="text-sm">{review.admin_reply}</p>
            {review.admin_reply_date && (
              <p className="text-xs text-muted-foreground mt-2">
                Replied on {new Date(review.admin_reply_date).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        {showAdminActions && !review.admin_reply && (
          <div className="mt-4">
            {!showReplyForm ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowReplyForm(true)}
              >
                <FaReply className="w-4 h-4 mr-2" />
                Reply
              </Button>
            ) : (
              <div className="space-y-3">
                <Textarea
                  placeholder="Write your reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowReplyForm(false);
                      setReplyText("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleReplySubmit}
                    disabled={!replyText.trim()}
                  >
                    Send Reply
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-muted-foreground mt-4">
          {new Date(review.created_at).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
