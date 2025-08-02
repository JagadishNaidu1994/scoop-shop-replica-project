
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ContactSubmissionsTab = () => {
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">User Messages</CardTitle>
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
