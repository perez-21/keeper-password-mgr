import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { PasswordEntry, usePasswords } from '@/context/PasswordContext';
import { Eye } from 'lucide-react';
import { EyeOff } from 'lucide-react';

interface UpdatePasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  oldPassword: PasswordEntry;
}

const UpdatePasswordModal: React.FC<UpdatePasswordModalProps> = ({ open, onOpenChange, oldPassword }) => {
  const { updatePassword } = usePasswords();
  const { toast } = useToast();
  const [title, setTitle] = React.useState(oldPassword.title);
  const [username, setUsername] = React.useState(oldPassword.username);
  const [password, setPassword] = React.useState(oldPassword.password);
  const [website, setWebsite] = React.useState(oldPassword.website || '');
  const [showPassword, setShowPassword] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setTitle(oldPassword.title);
      setUsername(oldPassword.username);
      setPassword(oldPassword.password);
      setWebsite(oldPassword.website || '');
    }
  }, [open, oldPassword]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onOpenChange(false);
    setShowPassword(false);

    if (!title || !username || !password) {
      toast({
        title: "Missing fields",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }

    updatePassword(oldPassword.id, {
      title,
      username,
      password,
      website,
    });

    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setTitle("");
    setUsername( "");
    setPassword("");
    setWebsite("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Update Password</DialogTitle>
            <DialogDescription>
              Update the details of the password you want to save.
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
              <div className="flex items-center gap-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? <EyeOff /> : <Eye />}
                </Button>
              </div>
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
                setShowPassword(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-keeper-purple hover:bg-keeper-dark">
              Save Password
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdatePasswordModal;
