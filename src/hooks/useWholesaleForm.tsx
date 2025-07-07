
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WholesaleFormData {
  name: string;
  email: string;
  businessType: string;
  message: string;
}

export const useWholesaleForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const submitForm = async (formData: WholesaleFormData) => {
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-wholesale-email', {
        body: formData
      });

      if (error) {
        throw error;
      }

      console.log('Form submitted successfully:', data);
      
      toast({
        title: "Inquiry Sent Successfully!",
        description: "We've received your wholesale inquiry and will contact you within 24 hours. Please check your email for confirmation.",
      });

      return { success: true };
    } catch (error) {
      console.error('Error submitting form:', error);
      
      toast({
        title: "Error",
        description: "There was an error sending your inquiry. Please try again or contact us directly.",
        variant: "destructive",
      });

      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitForm,
    isSubmitting
  };
};
