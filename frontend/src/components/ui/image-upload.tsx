import React, { useState, useRef } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Upload, X, Image } from 'lucide-react';

interface ImageUploadProps {
  label: string;
  value?: string;
  onChange: (imageUrl: string) => void;
  placeholder?: string;
  required?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  value,
  onChange,
  placeholder,
  required = false
}) => {
  const [preview, setPreview] = useState<string>(value || '');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Create a data URL for preview and storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setPreview(dataUrl);
        onChange(dataUrl);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUrlInput = (url: string) => {
    setPreview(url);
    onChange(url);
  };

  return (
    <div className="space-y-4">
      <Label htmlFor={`upload-${label}`} className="text-sm font-medium">
        {label} {required && '*'}
      </Label>
      
      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="max-w-full h-48 object-contain mx-auto rounded-lg"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Image className="h-12 w-12 text-gray-400 mx-auto" />
            <div>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="mb-2"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Upload Image'}
              </Button>
              <p className="text-sm text-gray-500">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        id={`upload-${label}`}
      />

      {/* Alternative URL input */}
      <div className="space-y-2">
        <Label className="text-sm text-gray-600">Or enter image URL:</Label>
        <Input
          type="url"
          placeholder={placeholder || "https://example.com/image.jpg"}
          value={preview.startsWith('data:') ? '' : preview}
          onChange={(e) => handleUrlInput(e.target.value)}
          className="text-sm"
        />
      </div>
    </div>
  );
};