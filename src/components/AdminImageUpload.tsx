import React, { useState, useRef } from 'react';
import { Upload, Check, X } from 'lucide-react';
import { useAdminImage } from '@/contexts/AdminImageContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AdminImageUploadProps {
  src: string;
  alt: string;
  className?: string;
  imagePath: string; // Path where the image should be saved (e.g., "hero-section", "product-showcase")
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onImageUpdate?: (newUrl: string) => void; // Callback when image is updated
}

const AdminImageUpload: React.FC<AdminImageUploadProps> = ({
  src,
  alt,
  className,
  imagePath,
  children,
  style,
  onImageUpdate,
}) => {
  const { isAdminMode, isEditingImages } = useAdminImage();
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(src);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type - support all common image formats
    const validImageTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 
      'image/webp', 'image/svg+xml', 'image/bmp', 'image/tiff'
    ];
    
    if (!validImageTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please select a valid image file (JPEG, PNG, GIF, WebP, SVG, BMP, TIFF)',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 10MB for better support)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'File size must be less than 10MB',
        variant: 'destructive',
      });
      return;
    }

    // Create a data URL for preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleApply = async () => {
    if (!preview) return;

    setIsUploading(true);

    try {
      // Convert data URL to blob
      const response = await fetch(preview);
      const blob = await response.blob();
      
      // Create a unique filename with proper extension
      const timestamp = Date.now();
      const fileExtension = blob.type.split('/')[1].replace('svg+xml', 'svg');
      const fileName = `${imagePath}-${timestamp}.${fileExtension}`;
      const filePath = `images/${fileName}`;

      console.log('Uploading file:', fileName, 'Size:', blob.size, 'Type:', blob.type);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('website-images')
        .upload(filePath, blob, {
          cacheControl: '3600',
          upsert: true,
          contentType: blob.type
        });

      if (error) {
        console.error('Upload error:', error);
        toast({
          title: 'Upload failed',
          description: error.message || 'Failed to upload image to storage',
          variant: 'destructive',
        });
        return;
      }

      console.log('Upload successful:', data);

      // Get the public URL
      const { data: publicData } = supabase.storage
        .from('website-images')
        .getPublicUrl(filePath);

      const newImageUrl = publicData.publicUrl;
      console.log('New image URL:', newImageUrl);

      // Update the current image URL
      setCurrentImageUrl(newImageUrl);
      setPreview(null);
      
      // Call the callback if provided
      if (onImageUpdate) {
        onImageUpdate(newImageUrl);
      }
      
      toast({
        title: 'Image updated successfully',
        description: `Image saved as ${fileName}`,
      });
      
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload failed',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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

  // If not in admin mode or not editing images, render the original content
  if (!isAdminMode || !isEditingImages) {
    return children || <img src="/lovable-uploads/8f104d86-6704-4342-91cf-737c838abdb7.png" alt={alt} className={className} style={style} />;
  }

  return (
    <div className="relative group inline-block">
      {children || <img src={preview || "/lovable-uploads/8f104d86-6704-4342-91cf-737c838abdb7.png"} alt={alt} className={className} style={style} />}
      
      {/* Upload overlay - always visible in admin edit mode */}
      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center z-10">
        <div className="flex space-x-2">
          {!preview && (
            <button
              onClick={handleUploadClick}
              disabled={isUploading}
              className="bg-white text-black px-3 py-2 rounded-full hover:bg-gray-100 transition-colors flex items-center space-x-1 text-sm font-medium shadow-lg"
            >
              <Upload className="h-4 w-4" />
              <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
            </button>
          )}
          
          {preview && (
            <>
              <button
                onClick={handleApply}
                disabled={isUploading}
                className="bg-green-500 text-white px-3 py-2 rounded-full hover:bg-green-600 transition-colors flex items-center space-x-1 text-sm font-medium shadow-lg"
              >
                <Check className="h-4 w-4" />
                <span>{isUploading ? 'Saving...' : 'Apply'}</span>
              </button>
              <button
                onClick={handleCancelPreview}
                disabled={isUploading}
                className="bg-red-500 text-white px-3 py-2 rounded-full hover:bg-red-600 transition-colors flex items-center space-x-1 text-sm font-medium shadow-lg"
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
        accept="image/*,.jpg,.jpeg,.png,.gif,.webp,.svg,.bmp,.tiff"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {/* Image path indicator */}
      <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20">
        {imagePath}
      </div>
    </div>
  );
};

export default AdminImageUpload;
