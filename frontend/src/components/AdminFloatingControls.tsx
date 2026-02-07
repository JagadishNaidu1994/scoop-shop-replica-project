
import React from 'react';
import { Edit, Eye, Settings } from 'lucide-react';
import { useAdminImage } from '@/contexts/AdminImageContext';
import { Button } from '@/components/ui/button';

const AdminFloatingControls: React.FC = () => {
  const { isAdminMode, isEditingImages, toggleImageEditing } = useAdminImage();

  if (!isAdminMode) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-black/90 backdrop-blur-sm text-white rounded-xl shadow-2xl p-4 border border-gray-800">
        <div className="text-xs font-medium text-gray-300 mb-3 text-center">Admin Controls</div>
        
        <Button
          onClick={toggleImageEditing}
          variant={isEditingImages ? "default" : "outline"}
          size="sm"
          className={`flex items-center space-x-2 ${
            isEditingImages 
              ? 'bg-white hover:bg-gray-100 text-black' 
              : 'bg-transparent border-gray-600 text-white hover:bg-gray-800'
          }`}
        >
          {isEditingImages ? <Eye className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
          <span>{isEditingImages ? 'Exit Edit' : 'Edit Images'}</span>
        </Button>
        
        <div className="text-xs text-gray-400 mt-3 text-center max-w-48">
          {isEditingImages ? 'Hover over images to replace them' : 'Click to enable image editing'}
        </div>
      </div>
    </div>
  );
};

export default AdminFloatingControls;
