import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function DeleteAccount() {
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-red-500" />
            Delete Account Permanently
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-red-800 mb-2">What will be deleted:</h4>
            <ul className="space-y-1 text-sm text-red-700">
              <li>• Your profile and account information</li>
              <li>• All uploaded files and documents</li>
              <li>• Account settings and preferences</li>
              <li>• Billing history and subscription data</li>
              <li>• All associated data and backups</li>
            </ul>
          </div>
          <div>
            <Label htmlFor="delete-confirmation" className="text-sm font-medium">
              Type "DELETE" to confirm:
            </Label>
            <Input
              id="delete-confirmation"
              value={deleteConfirmation}
              onChange={e => setDeleteConfirmation(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="mt-2"
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setDeleteConfirmation('')}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700"
            disabled={deleteConfirmation !== 'DELETE'}
            onClick={() => {
              // Handle account deletion logic here
              setDeleteConfirmation('');
            }}
          >
            Delete Account Permanently
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
