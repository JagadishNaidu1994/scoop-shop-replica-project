import React, { useState, useRef, useEffect } from 'react';
import { useAdminEdit } from '@/contexts/AdminEditContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Save, X } from 'lucide-react';
interface AdminEditableTextProps {
  pageId: string;
  contentKey: string;
  defaultValue: string;
  className?: string;
  element?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
  multiline?: boolean;
  placeholder?: string;
  children?: React.ReactNode;
}
const AdminEditableText: React.FC<AdminEditableTextProps> = ({
  pageId,
  contentKey,
  defaultValue,
  className = '',
  element: Element = 'span',
  multiline = false,
  placeholder,
  children
}) => {
  const {
    isAdminMode,
    isEditingEnabled,
    getPageContent,
    updatePageContent
  } = useAdminEdit();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const currentValue = getPageContent(pageId, contentKey, defaultValue);
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);
  const handleEdit = () => {
    setEditValue(currentValue);
    setIsEditing(true);
  };
  const handleSave = async () => {
    await updatePageContent(pageId, contentKey, editValue, 'text');
    setIsEditing(false);
  };
  const handleCancel = () => {
    setEditValue('');
    setIsEditing(false);
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  // If not in admin mode or editing not enabled, render normal content
  if (!isAdminMode || !isEditingEnabled) {
    return;
  }

  // If editing, show input/textarea
  if (isEditing) {
    return <div className="relative inline-block w-full">
        {multiline ? <Textarea ref={inputRef as React.RefObject<HTMLTextAreaElement>} value={editValue} onChange={e => setEditValue(e.target.value)} onKeyDown={handleKeyDown} className={`${className} min-h-[100px] resize-vertical`} placeholder={placeholder} /> : <Input ref={inputRef as React.RefObject<HTMLInputElement>} value={editValue} onChange={e => setEditValue(e.target.value)} onKeyDown={handleKeyDown} className={className} placeholder={placeholder} />}
        <div className="absolute -top-12 right-0 flex space-x-1 bg-white border rounded-md shadow-lg p-1 z-50">
          <Button size="sm" variant="ghost" onClick={handleSave} className="h-8 w-8 p-0 text-green-600 hover:bg-green-50">
            <Save className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" onClick={handleCancel} className="h-8 w-8 p-0 text-red-600 hover:bg-red-50">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>;
  }

  // Editable state - show content with edit overlay
  return <div className="relative group inline-block">
      <Element className={`${className} cursor-pointer`} onClick={handleEdit}>
        {children || currentValue || defaultValue}
      </Element>
      <div className="absolute inset-0 bg-blue-500 bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded border-2 border-blue-500 border-dashed flex items-center justify-center">
        <Button size="sm" variant="secondary" className="text-xs" onClick={handleEdit}>
          <Edit className="h-3 w-3 mr-1" />
          Edit
        </Button>
      </div>
      <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20">
        {contentKey}
      </div>
    </div>;
};
export default AdminEditableText;