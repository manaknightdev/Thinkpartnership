import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Palette, Image, Type, Globe } from "lucide-react";
import React, { useState } from "react";

const ClientBrandingPage = () => {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [primaryColor, setPrimaryColor] = useState("#22C55E");
  const [secondaryColor, setSecondaryColor] = useState("#3B82F6");
  const [fontFamily, setFontFamily] = useState("Inter, sans-serif");
  const [subdomain, setSubdomain] = useState("yourbrand");

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setLogoFile(event.target.files[0]);
      toast.success("Logo selected!");
    }
  };

  const handleSaveBranding = () => {
    toast.success("Branding settings saved successfully!");
    console.log({ logoFile, primaryColor, secondaryColor, fontFamily, subdomain });
    // In a real app, this would upload the logo and save settings to the backend
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Marketplace Branding</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        Customize the look and feel of your branded sub-marketplace to match your company's identity.
      </p>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" /> Logo & Favicon
          </CardTitle>
          <CardDescription>Upload your company logo and favicon for your marketplace.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="logo-upload">Upload Logo</Label>
            <Input id="logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Max file size 5MB. PNG, JPG, SVG recommended.</p>
            {logoFile && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Selected: {logoFile.name}</p>
            )}
          </div>
          <div>
            <Label htmlFor="favicon-upload">Upload Favicon</Label>
            <Input id="favicon-upload" type="file" accept="image/*" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Small icon for browser tabs (e.g., 32x32px PNG).</p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" /> Color Scheme
          </CardTitle>
          <CardDescription>Choose your brand's primary and secondary colors.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="primary-color">Primary Color</Label>
              <Input id="primary-color" type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-full h-10 p-1" />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Used for buttons, highlights, etc.</p>
            </div>
            <div>
              <Label htmlFor="secondary-color">Secondary Color</Label>
              <Input id="secondary-color" type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="w-full h-10 p-1" />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Used for accents and secondary elements.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" /> Typography
          </CardTitle>
          <CardDescription>Select a font family for your marketplace text.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="font-family">Font Family (CSS compatible)</Label>
            <Input id="font-family" type="text" placeholder="e.g., 'Roboto', sans-serif" value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Enter a CSS font-family value.</p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" /> Custom Domain / Subdomain
          </CardTitle>
          <CardDescription>Configure your marketplace URL.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="subdomain">Your Sub-marketplace URL</Label>
            <div className="flex items-center space-x-2">
              <Input id="subdomain" type="text" placeholder="yourbrand" value={subdomain} onChange={(e) => setSubdomain(e.target.value)} className="flex-grow" />
              <span className="text-gray-600 dark:text-gray-400">.thinkpartnerships.com</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">This will be your unique marketplace address.</p>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            For a fully custom domain (e.g., `marketplace.yourcompany.com`), you would typically configure DNS settings with your domain provider.
          </p>
        </CardContent>
      </Card>

      <div className="text-center mt-10">
        <Button size="lg" onClick={handleSaveBranding}>
          Save All Branding Settings
        </Button>
      </div>
    </div>
  );
};

export default ClientBrandingPage;