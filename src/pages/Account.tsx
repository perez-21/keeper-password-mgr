
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { KeyRound, User, Mail, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

const Account = () => {
  const { user, isLoaded, isAuthenticated, updateProfile, updateEmail } = useAuth();
  
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isPending, setIsPending] = useState(false);
  
  const handleUpdateProfile = async () => {
    if (!isLoaded || !isAuthenticated) return;
    
    try {
      setIsPending(true);
      
      // Update name
      if (firstName !== user?.firstName || lastName !== user?.lastName) {
        await updateProfile({
          firstName,
          lastName
        });
      }
      
      // Update email if changed
      if (email !== user?.email && email.trim()) {
        await updateEmail(email);
      }
      
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsPending(false);
    }
  };
  
  if (!isLoaded) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p>Loading account details...</p>
        </div>
      </Layout>
    );
  }
  
  if (!isAuthenticated || !user) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p>Please sign in to access your account.</p>
          <Button variant="link" asChild>
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
            <User className="w-8 h-8 text-keeper-purple" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Account</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Manage your account settings and profile
          </p>
        </div>
        
        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" /> Personal Information
              </CardTitle>
              <CardDescription>
                Update your name and profile details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleUpdateProfile} 
                disabled={isPending}
                className="bg-keeper-purple hover:bg-keeper-dark"
              >
                <Save className="h-4 w-4 mr-2" />
                {isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" /> Email Address
              </CardTitle>
              <CardDescription>
                Update your email (verification required)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                />
                <p className="text-xs text-muted-foreground">
                  When changing your email, you'll need to verify the new address
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleUpdateProfile} 
                disabled={isPending || email === user.email}
                className="bg-keeper-purple hover:bg-keeper-dark"
              >
                <Save className="h-4 w-4 mr-2" />
                {isPending ? 'Updating...' : 'Update Email'}
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyRound className="h-5 w-5" /> Security
              </CardTitle>
              <CardDescription>
                Manage your security settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                You can change your password and enable additional security features in your security settings.
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => toast.info("Password change functionality will be implemented soon")}
                variant="outline"
              >
                Change Password
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Account;
