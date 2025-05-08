
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import PasswordVault from '@/components/PasswordVault';
import PasswordGenerator from '@/components/PasswordGenerator';
import AddPasswordModal from '@/components/AddPasswordModal';
import { Button } from '@/components/ui/button';
import { KeyRound, Plus } from 'lucide-react';
import { PasswordProvider } from '@/context/PasswordContext';

const Index = () => {
  const [addPasswordOpen, setAddPasswordOpen] = useState(false);

  return (
    <PasswordProvider>
      <Layout>
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
              <KeyRound className="w-8 h-8 text-keeper-purple" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Keeper</h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              A simple and secure way to store and manage your passwords
            </p>
          </div>

          <div className="flex flex-col-reverse md:flex-row gap-8 mb-8">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Your Passwords</h2>
                <Button onClick={() => setAddPasswordOpen(true)} className="bg-keeper-purple hover:bg-keeper-dark">
                  <Plus className="h-4 w-4 mr-2" /> Add Password
                </Button>
              </div>
              <PasswordVault />
            </div>
            <div className="md:w-1/3">
              <PasswordGenerator />
            </div>
          </div>
        </div>
        <AddPasswordModal open={addPasswordOpen} onOpenChange={setAddPasswordOpen} />
      </Layout>
    </PasswordProvider>
  );
};

export default Index;
