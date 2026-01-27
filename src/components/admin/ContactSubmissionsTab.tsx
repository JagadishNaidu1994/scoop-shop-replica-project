
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ContactSubmissionsTab = () => {
  return (
    <Card className="rounded-3xl bg-white/80 backdrop-blur-xl shadow-xl border-slate-200">
      <CardHeader>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">User Messages</CardTitle>
        <p className="text-gray-600">Contact submissions feature coming soon</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <p className="mb-2">Contact submissions table not yet configured</p>
            <p className="text-sm">This feature will be available once the database schema is set up</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactSubmissionsTab;
