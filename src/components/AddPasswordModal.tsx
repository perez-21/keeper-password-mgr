
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { usePasswords } from '@/context/PasswordContext';

interface AddPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddPasswordModal: React.FC<AddPasswordModalProps> = ({ open, onOpenChange }) => {
  const { addPassword } = usePasswords();
  const { toast } = useToast();
  const [title, setTitle] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [website, setWebsite] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !username || !password) {
      toast({
        title: "Missing fields",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }

    addPassword({
      title,
      username,
      password,
      website,
    });

    toast({
      title: "Password added",
      description: "Your password has been saved securely.",
    });

    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setTitle('');
    setUsername('');
    setPassword('');
    setWebsite('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Password</DialogTitle>
            <DialogDescription>
              Enter the details of the password you want to save.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="required">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Gmail, Netflix, Bank"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username" className="required">Username / Email</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. your.email@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="required">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="website">Website URL (optional)</Label>
              <Input
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="e.g. https://example.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-whisper-purple hover:bg-whisper-dark">
              Save Password
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPasswordModal;
