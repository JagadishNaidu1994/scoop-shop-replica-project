
import React from 'react';
import { useAdminEdit } from '@/contexts/AdminEditContext';
import AdminImageUpload from '@/components/AdminImageUpload';

interface AdminEditableImageProps {
  pageId: string;
  contentKey: string;
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const AdminEditableImage: React.FC<AdminEditableImageProps> = ({
  pageId,
  contentKey,
  src,
  alt,
  className,
  style,
  children
}) => {
  const { isAdminMode, isEditingEnabled, getPageContent, updatePageContent } = useAdminEdit();

  const currentSrc = getPageContent(pageId, contentKey, src);

  const handleImageUpdate = async (newUrl: string) => {
    await updatePageContent(pageId, contentKey, newUrl, 'image');
  };

  // If not in admin mode or editing not enabled, render normal image
  if (!isAdminMode || !isEditingEnabled) {
    return children || <img src={currentSrc} alt={alt} className={className} style={style} />;
  }

  // In admin edit mode, use AdminImageUpload
  return (
    <AdminImageUpload
      src={currentSrc}
      alt={alt}
      className={className}
      style={style}
      imagePath={`${pageId}-${contentKey}`}
      onImageUpdate={handleImageUpdate}
    >
      {children}
    </AdminImageUpload>
  );
};

export default AdminEditableImage;
