
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ContentTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Coupon Management</h2>
      </div>

      <Card className="rounded-3xl bg-white/80 backdrop-blur-xl shadow-xl border-slate-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Coupon Management</CardTitle>
          <p className="text-gray-600">Coupon management feature coming soon</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <p className="mb-2">Coupon system not yet configured</p>
              <p className="text-sm">This feature will be available once the coupon database schema is set up</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentTab;
