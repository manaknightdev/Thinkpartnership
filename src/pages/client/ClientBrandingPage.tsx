import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Palette, Image, Type, Globe, Upload } from "lucide-react";
import React, { useState, useEffect } from "react";
import ClientAPI from "@/services/ClientAPI";
import { useBranding } from "@/contexts/BrandingContext";

// Helper function to convert relative URLs to full URLs
const getFullImageUrl = (url: string): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url; // Already a full URL
  }
  if (url.startsWith('/uploads/')) {
    // Use local development server for development, production server for production
    const baseUrl = import.meta.env.DEV
      ? 'http://localhost:5172'
      : 'https://baas.mytechpassport.com';
    return `${baseUrl}${url}`;
  }
  return url;
};

const ClientBrandingPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [currentLogoUrl, setCurrentLogoUrl] = useState<string>("");
  const [companyName, setCompanyName] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#22C55E");
  const [secondaryColor, setSecondaryColor] = useState("#3B82F6");
  const [fontFamily, setFontFamily] = useState("Inter, sans-serif");
  const [subdomain, setSubdomain] = useState("yourbrand");

  const { updateBranding, refreshBranding } = useBranding();

  useEffect(() => {
    loadBrandingSettings();
  }, []);

  const loadBrandingSettings = async () => {
    try {
      setLoading(true);
      const brandingData = await ClientAPI.getBrandingSettings();

      if (brandingData) {
        setCompanyName(brandingData.company_name || "");
        setCurrentLogoUrl(getFullImageUrl(brandingData.logo_url || ""));
        setPrimaryColor(brandingData.primary_color || "#22C55E");
        setSecondaryColor(brandingData.secondary_color || "#3B82F6");
        setFontFamily(brandingData.font_family || "Inter, sans-serif");
        setSubdomain(brandingData.marketplace_subdomain || "yourbrand");
      }
    } catch (error) {
      console.error('Error loading branding settings:', error);
      toast.error('Failed to load branding settings');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setLogoFile(event.target.files[0]);
      toast.success("Logo selected!");
    }
  };

  const uploadLogo = async (file: File): Promise<string> => {
    const result = await ClientAPI.uploadFile(file, 'Client Logo');
    return result.url;
  };

  const handleSaveBranding = async () => {
    try {
      setSaving(true);
      let logoUrl = currentLogoUrl;

      // Upload logo if a new file is selected
      if (logoFile) {
        setUploading(true);
        try {
          logoUrl = await uploadLogo(logoFile);
          setCurrentLogoUrl(getFullImageUrl(logoUrl));
          toast.success("Logo uploaded successfully!");
        } catch (uploadError) {
          console.error('Error uploading logo:', uploadError);
          toast.error('Failed to upload logo');
          return;
        } finally {
          setUploading(false);
        }
      }

      const brandingData = {
        company_name: companyName,
        marketplace_subdomain: subdomain,
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        font_family: fontFamily,
        logo_url: logoUrl
      };

      await ClientAPI.updateBrandingSettings(brandingData);
      toast.success("Branding settings saved successfully!");

      // Update the branding context
      updateBranding(brandingData);

      // Refresh branding data from server
      await refreshBranding();

      // Clear the selected file since it's now uploaded
      setLogoFile(null);
    } catch (error) {
      console.error('Error saving branding settings:', error);
      toast.error('Failed to save branding settings');
    } finally {
      setSaving(false);
    }
  };



  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading branding settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Marketplace Branding</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
        Customize the look and feel of your branded sub-marketplace to match your company's identity.
      </p>



      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" /> Company Information
          </CardTitle>
          <CardDescription>Set your company name and upload your logo for your marketplace.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="company-name">Company Name</Label>
            <Input
              id="company-name"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter your company name"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">This will be displayed in your marketplace header.</p>
          </div>
          <div>
            <Label htmlFor="logo-upload">Upload Logo</Label>
            <div className="flex items-center space-x-4">
              <Input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="flex-1"
              />
              {uploading && (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-gray-600">Uploading...</span>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Max file size 5MB. PNG, JPG, SVG recommended.</p>
            {logoFile && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Selected: {logoFile.name}</p>
            )}
            {currentLogoUrl && !logoFile && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Current logo:</p>
                <img src={currentLogoUrl} alt="Current logo" className="h-16 w-auto border rounded" />
              </div>
            )}
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
              <Input
                id="primary-color"
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-full h-10 p-1"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Used for buttons, highlights, etc.</p>
            </div>
            <div>
              <Label htmlFor="secondary-color">Secondary Color</Label>
              <Input
                id="secondary-color"
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-full h-10 p-1"
              />
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
            <Input
              id="font-family"
              type="text"
              placeholder="e.g., 'Roboto', sans-serif"
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Enter a CSS font-family value.</p>
          </div>
        </CardContent>
      </Card>

      {/* <Card className="mb-8">
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
              <span className="text-gray-600 dark:text-gray-400">.realpartneros.com</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">This will be your unique marketplace address.</p>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            For a fully custom domain (e.g., `marketplace.yourcompany.com`), you would typically configure DNS settings with your domain provider.
          </p>
        </CardContent>
      </Card> */}

      <div className="text-center mt-10">
        <Button size="lg" onClick={handleSaveBranding} disabled={saving || uploading}>
          {saving || uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {uploading ? 'Uploading Logo...' : 'Saving...'}
            </>
          ) : (
            'Save All Branding Settings'
          )}
        </Button>
      </div>
    </div>
  );
};

export default ClientBrandingPage;