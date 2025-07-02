
import React from 'react';
import { Edit, Eye, Settings } from 'lucide-react';
import { useAdminImage } from '@/contexts/AdminImageContext';
import { Button } from '@/components/ui/button';

const AdminFloatingControls: React.FC = () => {
  const { isAdminMode, isEditingImages, toggleImageEditing } = useAdminImage();

  if (!isAdminMode) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-black text-white rounded-lg shadow-lg p-3 flex flex-col space-y-2">
        <div className="text-xs font-medium text-gray-300 mb-2">Admin Controls</div>
        
        <Button
          onClick={toggleImageEditing}
          variant={isEditingImages ? "default" : "outline"}
          size="sm"
          className={`flex items-center space-x-2 ${
            isEditingImages 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-transparent border-gray-600 text-white hover:bg-gray-800'
          }`}
        >
          {isEditingImages ? <Eye className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
          <span>{isEditingImages ? 'Exit Edit' : 'Edit Images'}</span>
        </Button>
        
        <div className="text-xs text-gray-400 mt-2">
          {isEditingImages ? 'Hover over images to replace them' : 'Click to enable image editing'}
        </div>
      </div>
    </div>
  );
};

export default AdminFloatingControls;
