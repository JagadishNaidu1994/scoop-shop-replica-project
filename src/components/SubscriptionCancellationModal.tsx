
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface SubscriptionCancellationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (discountAccepted: boolean) => void;
}

const SubscriptionCancellationModal: React.FC<SubscriptionCancellationModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cancel Subscription?</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-600">
            Before you cancel, would you like to keep your subscription with a 15% discount?
          </p>
          <div className="flex gap-3">
            <Button
              onClick={() => {
                onConfirm(true);
                onClose();
              }}
              className="flex-1 bg-[#192a3a] hover:bg-[#0f1a26] text-white"
            >
              Keep with Discount
            </Button>
            <Button
              onClick={() => {
                onConfirm(false);
                onClose();
              }}
              variant="outline"
              className="flex-1"
            >
              Cancel Anyway
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionCancellationModal;
