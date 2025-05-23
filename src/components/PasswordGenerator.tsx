import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { generate } from 'generate-password-browser';
import { CopyIcon } from 'lucide-react';
import AddPasswordModal from './AddPasswordModal';

const PasswordGenerator: React.FC = () => {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [addPasswordOpen, setAddPasswordOpen] = useState(false);
  const { toast } = useToast();

  const generatePassword = () => {
    // let charset = '';
    // if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    // if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    // if (includeNumbers) charset += '0123456789';
    // if (includeSymbols) charset += '!@#$%^&*()_-+=<>?';

    // if (!charset) {
    //   toast({
    //     title: "No character set selected",
    //     description: "Please select at least one character type for your password.",
    //     variant: "destructive",
    //   });
    //   return;
    // }

    if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
      toast({
        title: "No character set selected",
        description: "Please select at least one character type for your password.",
        variant: "destructive",
      });
    }

  
    const password = generate({
      length: length,
      numbers: includeNumbers,
      symbols: includeSymbols,
      uppercase: includeUppercase,
      lowercase: includeLowercase,
      excludeSimilarCharacters: true,
    });

    setGeneratedPassword(password);
  };

  const copyToClipboard = () => {
    if (!generatedPassword) return;
    navigator.clipboard.writeText(generatedPassword).then(() => {
      toast({
        title: "Copied!",
        description: "Password copied to clipboard.",
      });
    });
  };

  return (
    <>
      <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle>Password Generator</CardTitle>
          <CardDescription>Create secure and random passwords</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-2">
            <Input
              value={generatedPassword}
              onChange={(e) => setGeneratedPassword(e.target.value)}
              placeholder="Generated password"
              className="font-mono"
              readOnly
            />
            
            <Button onClick={copyToClipboard} variant="outline" disabled={!generatedPassword}>
              <CopyIcon className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
          <Button onClick={generatePassword} className="bg-keeper-purple hover:bg-keeper-dark">
              Generate
            </Button>
            <Button 
              onClick={() => setAddPasswordOpen(true)} 
              className="bg-black hover:text-keeper-purple hover:bg-black"
              disabled={!generatedPassword}
            >
              Use Password
            </Button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Password Length ({length})</Label>
              </div>
              <Slider
                value={[length]}
                onValueChange={(value) => setLength(value[0])}
                min={8}
                max={32}
                step={1}
                className="py-4"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="uppercase">Include Uppercase</Label>
                <Switch
                  id="uppercase"
                  checked={includeUppercase}
                  onCheckedChange={setIncludeUppercase}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="lowercase">Include Lowercase</Label>
                <Switch
                  id="lowercase"
                  checked={includeLowercase}
                  onCheckedChange={setIncludeLowercase}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="numbers">Include Numbers</Label>
                <Switch
                  id="numbers"
                  checked={includeNumbers}
                  onCheckedChange={setIncludeNumbers}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="symbols">Include Symbols</Label>
                <Switch
                  id="symbols"
                  checked={includeSymbols}
                  onCheckedChange={setIncludeSymbols}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <AddPasswordModal 
        open={addPasswordOpen} 
        onOpenChange={setAddPasswordOpen} 
        initialPassword={generatedPassword}
      />
    </>
  );
};

export default PasswordGenerator;
