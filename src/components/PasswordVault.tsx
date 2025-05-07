
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import PasswordItem from './PasswordItem';
import { usePasswords } from '@/context/PasswordContext';

const PasswordVault: React.FC = () => {
  const { passwords } = usePasswords();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPasswords = passwords.filter((pass) =>
    pass.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pass.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (pass.website && pass.website.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle>Password Vault</CardTitle>
        <CardDescription>
          Your securely stored passwords
        </CardDescription>
        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search passwords..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredPasswords.length === 0 ? (
          <div className="text-center p-4 text-muted-foreground">
            {passwords.length === 0
              ? "No passwords saved yet. Add your first password to get started."
              : "No passwords match your search query."}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredPasswords.map((password) => (
              <PasswordItem key={password.id} password={password} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PasswordVault;
