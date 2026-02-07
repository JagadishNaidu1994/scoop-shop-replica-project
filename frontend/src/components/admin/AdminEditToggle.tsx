
import React from 'react';
import { useAdminEdit } from '@/contexts/AdminEditContext';
import { Button } from '@/components/ui/button';
import { Edit, EyeOff } from 'lucide-react';

const AdminEditToggle: React.FC = () => {
  const { isAdminMode, isEditingEnabled, toggleEditMode, loading } = useAdminEdit();

  if (!isAdminMode) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={toggleEditMode}
        disabled={loading}
        className={`shadow-lg ${
          isEditingEnabled 
            ? 'bg-red-600 hover:bg-red-700 text-white' 
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {isEditingEnabled ? (
          <>
            <EyeOff className="h-4 w-4 mr-2" />
            Exit Edit Mode
          </>
        ) : (
          <>
            <Edit className="h-4 w-4 mr-2" />
            Edit Page
          </>
        )}
      </Button>
    </div>
  );
};

export default AdminEditToggle;
