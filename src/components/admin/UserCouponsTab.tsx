
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";

export const UserCouponsTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User-Specific Coupons</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Coupons System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">User Coupons System Not Set Up</p>
            <p className="text-muted-foreground mb-4">
              The user-specific coupons system requires additional database tables to function properly.
            </p>
            <div className="text-left max-w-md mx-auto">
              <p className="text-sm font-medium mb-2">Required tables:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>coupon_codes - Store coupon information</li>
                <li>user_coupons - Link users to their assigned coupons</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                Once these tables are created, this tab will allow you to assign specific coupons to individual users
                and track their usage.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-muted-foreground">-</p>
              <p className="text-sm text-muted-foreground">Total Assigned</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-muted-foreground">-</p>
              <p className="text-sm text-muted-foreground">Available</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-muted-foreground">-</p>
              <p className="text-sm text-muted-foreground">Used</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
