
import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Trash, Globe, User, SquarePen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { PasswordEntry, usePasswords } from '@/context/PasswordContext';
import UpdatePasswordModal from './UpdatePasswordModal';

interface PasswordItemProps {
  password: PasswordEntry;
}

const PasswordItem: React.FC<PasswordItemProps> = ({ password }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [updatePasswordOpen, setUpdatePasswordOpen] = useState(false);

  const { toast } = useToast();
  const { deletePassword } = usePasswords();
  

  const handleToggleVisibility = () => {
    setShowPassword(!showPassword);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard.`,
      });
    });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this password?")) {
      deletePassword(password.id);
      toast({
        title: "Password deleted",
        description: `Entry for "${password.title}" has been deleted.`,
      });
    }
  };

  const handleUpdate = () => {
    setUpdatePasswordOpen(true);
  }

  return (
    <Card className="hover:shadow-md transition-shadow bg-white">
      <CardContent className="p-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">{password.title}</h3>
            <div className="flex justify-center items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleDelete}
                className="text-red-500 hover:text-red-700 hover:bg-red-100"
              >
                <Trash className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleUpdate}
                className="text-keeper-purple hover:text-white-700 hover:bg-keeper-dark"
              >
                <SquarePen className="h-4 w-4" />
              </Button>
            </div>
            
          </div>

          <div className="text-sm text-muted-foreground">
            {password.website && (
              <div className="flex items-center gap-2 mb-1">
                <Globe className="h-3.5 w-3.5" />
                <a 
                  href={password.website.startsWith('http') ? password.website : `https://${password.website}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline truncate"
                >
                  {password.website}
                </a>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 mt-2">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <User className="h-3.5 w-3.5" />
              <span className="truncate max-w-[150px]">{password.username}</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2"
              onClick={() => copyToClipboard(password.username, "Username")}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-mono truncate max-w-[150px]">
                {showPassword ? password.password : '••••••••••••'}
              </span>
            </div>
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2" 
                onClick={handleToggleVisibility}
              >
                {showPassword ? (
                  <EyeOff className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2"
                onClick={() => copyToClipboard(password.password, "Password")}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <UpdatePasswordModal open={updatePasswordOpen} onOpenChange={setUpdatePasswordOpen} oldPassword={password} />

    </Card>
  );
};

export default PasswordItem;
