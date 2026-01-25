
import React, { createContext, useContext, useState } from 'react';
import { useAdminCheck } from '@/hooks/useAdminCheck';

interface AdminImageContextType {
  isAdminMode: boolean;
  isEditingImages: boolean;
  toggleImageEditing: () => void;
}

const AdminImageContext = createContext<AdminImageContextType | undefined>(undefined);

export const useAdminImage = () => {
  const context = useContext(AdminImageContext);
  if (!context) {
    throw new Error('useAdminImage must be used within AdminImageProvider');
  }
  return context;
};

export const AdminImageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useAdminCheck();
  const [isEditingImages, setIsEditingImages] = useState(false);

  const toggleImageEditing = () => {
    setIsEditingImages(!isEditingImages);
  };

  return (
    <AdminImageContext.Provider
      value={{
        isAdminMode: isAdmin,
        isEditingImages,
        toggleImageEditing,
      }}
    >
      {children}
    </AdminImageContext.Provider>
  );
};
