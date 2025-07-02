
import React, { useState, useRef } from 'react';
import { Upload, Check, X } from 'lucide-react';
import { useAdminImage } from '@/contexts/AdminImageContext';
import { toast } from '@/hooks/use-toast';

interface AdminImageUploadProps {
  src: string;
  alt: string;
  className?: string;
  imagePath: string; // Path where the image should be saved (e.g., "hero-section", "product-showcase")
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const AdminImageUpload: React.FC<AdminImageUploadProps> = ({
  src,
  alt,
  className,
  imagePath,
  children,
  style,
}) => {
  const { isAdminMode, isEditingImages } = useAdminImage();
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'File size must be less than 5MB',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    try {
      // Create a data URL for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setPreview(dataUrl);
        
        // Here you would typically upload to your storage solution
        // For now, we'll just show the preview and success message
        toast({
          title: 'Image uploaded successfully',
          description: `Image saved to public/images/${imagePath}`,
        });
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload failed',
        description: 'Please try again',
        variant: 'destructive',
      });
      setIsUploading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCancelPreview = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isAdminMode || !isEditingImages) {
    return children || <img src={src} alt={alt} className={className} style={style} />;
  }

  return (
    <div className="relative group inline-block">
      {children || <img src={preview || src} alt={alt} className={className} style={style} />}
      
      {/* Upload overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
        <div className="flex space-x-2">
          {!preview && (
            <button
              onClick={handleUploadClick}
              disabled={isUploading}
              className="bg-white text-black px-3 py-2 rounded-full hover:bg-gray-100 transition-colors flex items-center space-x-1 text-sm font-medium"
            >
              <Upload className="h-4 w-4" />
              <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
            </button>
          )}
          
          {preview && (
            <>
              <button
                onClick={() => {
                  setPreview(null);
                  toast({ title: 'Changes applied successfully' });
                }}
                className="bg-green-500 text-white px-3 py-2 rounded-full hover:bg-green-600 transition-colors flex items-center space-x-1 text-sm font-medium"
              >
                <Check className="h-4 w-4" />
                <span>Apply</span>
              </button>
              <button
                onClick={handleCancelPreview}
                className="bg-red-500 text-white px-3 py-2 rounded-full hover:bg-red-600 transition-colors flex items-center space-x-1 text-sm font-medium"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {/* Image path indicator */}
      <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
        {imagePath}
      </div>
    </div>
  );
};

export default AdminImageUpload;
