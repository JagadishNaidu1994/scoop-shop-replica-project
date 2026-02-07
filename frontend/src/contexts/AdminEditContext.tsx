
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminCheck } from '@/hooks/useAdminCheck';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PageContent {
  id: string;
  page_id: string;
  content_key: string;
  content_value: string;
  content_type: 'text' | 'html' | 'image' | 'json';
  created_at: string;
  updated_at: string;
}

interface AdminEditContextType {
  isAdminMode: boolean;
  isEditingEnabled: boolean;
  toggleEditMode: () => void;
  updatePageContent: (pageId: string, contentKey: string, value: string, type?: 'text' | 'html' | 'image' | 'json') => Promise<void>;
  getPageContent: (pageId: string, contentKey: string, defaultValue?: string) => string;
  pageContent: Record<string, Record<string, string>>;
  loading: boolean;
}

const AdminEditContext = createContext<AdminEditContextType | undefined>(undefined);

export const useAdminEdit = () => {
  const context = useContext(AdminEditContext);
  if (!context) {
    throw new Error('useAdminEdit must be used within an AdminEditProvider');
  }
  return context;
};

export const AdminEditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { isAdmin } = useAdminCheck();
  const { toast } = useToast();
  
  const [isEditingEnabled, setIsEditingEnabled] = useState(false);
  const [pageContent, setPageContent] = useState<Record<string, Record<string, string>>>({});
  const [loading, setLoading] = useState(false);

  const isAdminMode = user && isAdmin;

  // Load all page content on mount
  useEffect(() => {
    if (isAdminMode) {
      loadAllPageContent();
    }
  }, [isAdminMode]);

  const loadAllPageContent = async () => {
    setLoading(true);
    try {
      // Direct query to page_content table
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error loading page content:', error);
        return;
      }

      if (data) {
        const contentMap: Record<string, Record<string, string>> = {};
        // Type assertion to ensure compatibility with our PageContent interface
        (data as PageContent[]).forEach((item: PageContent) => {
          if (!contentMap[item.page_id]) {
            contentMap[item.page_id] = {};
          }
          contentMap[item.page_id][item.content_key] = item.content_value;
        });
        setPageContent(contentMap);
      }
    } catch (error) {
      console.error('Error loading page content:', error);
      // Don't show error toast on initial load failure - table might be empty
    } finally {
      setLoading(false);
    }
  };

  const toggleEditMode = () => {
    setIsEditingEnabled(!isEditingEnabled);
    toast({
      title: isEditingEnabled ? "Edit Mode Disabled" : "Edit Mode Enabled",
      description: isEditingEnabled 
        ? "You can no longer edit page content" 
        : "Click on any text or image to edit it"
    });
  };

  const updatePageContent = async (
    pageId: string, 
    contentKey: string, 
    value: string, 
    type: 'text' | 'html' | 'image' | 'json' = 'text'
  ) => {
    try {
      // Use upsert to insert or update the content
      const { data, error } = await supabase
        .from('page_content')
        .upsert({
          page_id: pageId,
          content_key: contentKey,
          content_value: value,
          content_type: type,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'page_id,content_key'
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state
      setPageContent(prev => ({
        ...prev,
        [pageId]: {
          ...prev[pageId],
          [contentKey]: value
        }
      }));

      toast({
        title: "Content Updated",
        description: "Your changes have been saved successfully"
      });
    } catch (error) {
      console.error('Error updating page content:', error);
      toast({
        title: "Error",
        description: "Failed to update content",
        variant: "destructive"
      });
    }
  };

  const getPageContent = (pageId: string, contentKey: string, defaultValue: string = '') => {
    return pageContent[pageId]?.[contentKey] || defaultValue;
  };

  return (
    <AdminEditContext.Provider value={{
      isAdminMode: !!isAdminMode,
      isEditingEnabled,
      toggleEditMode,
      updatePageContent,
      getPageContent,
      pageContent,
      loading
    }}>
      {children}
    </AdminEditContext.Provider>
  );
};
