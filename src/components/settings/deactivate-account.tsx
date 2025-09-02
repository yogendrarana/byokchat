import { useState } from 'react';
import { UserX } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function DeactivateAccount() {
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);

  return (
    <Dialog open={isDeactivateDialogOpen} onOpenChange={setIsDeactivateDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50 bg-transparent">
          Deactivate Account
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserX className="w-5 h-5 text-orange-500" />
            Deactivate Account
          </DialogTitle>
          <DialogDescription>Are you sure you want to deactivate your account? This action will:</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Hide your profile from other users</li>
            <li>• Disable access to your account</li>
            <li>• Preserve all your data for future reactivation</li>
            <li>• Allow you to reactivate by logging in again</li>
          </ul>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDeactivateDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            className="bg-orange-600 hover:bg-orange-700"
            onClick={() => {
              setIsDeactivateDialogOpen(false);
            }}
          >
            Deactivate Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
