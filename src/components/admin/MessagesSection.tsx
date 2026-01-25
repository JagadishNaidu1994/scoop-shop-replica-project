
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Search } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
}

const MessagesSection: React.FC = () => {
  const [messages] = useState<Message[]>([
    {
      id: '1',
      sender: 'John Smith',
      subject: 'Order Issue',
      preview: 'I have a problem with my recent order...',
      timestamp: '2024-01-15T10:30:00Z',
      isRead: false,
      priority: 'high'
    },
    {
      id: '2',
      sender: 'Sarah Johnson',
      subject: 'Product Inquiry',
      preview: 'Could you tell me more about your matcha...',
      timestamp: '2024-01-14T14:20:00Z',
      isRead: true,
      priority: 'medium'
    },
    {
      id: '3',
      sender: 'Mike Brown',
      subject: 'Wholesale Opportunity',
      preview: 'Interested in wholesale pricing...',
      timestamp: '2024-01-13T09:15:00Z',
      isRead: true,
      priority: 'low'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const unreadCount = messages.filter(m => !m.isRead).length;

  const filteredMessages = messages.filter(message =>
    message.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="h-96">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            Messages
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </div>
          <Button size="sm">
            <Send className="w-4 h-4 mr-1" />
            Compose
          </Button>
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-64 overflow-y-auto">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                !message.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${!message.isRead ? 'font-semibold' : 'font-medium'}`}>
                    {message.sender}
                  </span>
                  <Badge 
                    variant={message.priority === 'high' ? 'destructive' : message.priority === 'medium' ? 'secondary' : 'outline'}
                    className="text-xs"
                  >
                    {message.priority}
                  </Badge>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(message.timestamp).toLocaleDateString()}
                </span>
              </div>
              <p className={`text-sm ${!message.isRead ? 'font-medium' : ''} mb-1`}>
                {message.subject}
              </p>
              <p className="text-xs text-gray-600 truncate">
                {message.preview}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MessagesSection;
