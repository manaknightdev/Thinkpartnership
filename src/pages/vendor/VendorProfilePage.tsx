import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Building, Phone, MapPin, Clock, Award, Users, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

import VendorAuthAPI, { UpdateVendorProfileData } from "@/services/VendorAuthAPI";
import { showSuccess, showError } from "@/utils/toast";

// Cities organized by province/territory
const citiesByProvince = {
  "Alberta": [
    "Calgary", "Edmonton", "Red Deer", "Lethbridge", "St. Albert", "Medicine Hat",
    "Grande Prairie", "Airdrie", "Spruce Grove", "Okotoks", "Lloydminster", "Fort McMurray",
    "Camrose", "Brooks", "Cold Lake", "Wetaskiwin", "Leduc", "Fort Saskatchewan",
    "Cochrane", "Beaumont", "Canmore", "Stony Plain", "Sylvan Lake", "Chestermere",
    "Lacombe", "Taber", "High River", "Hinton", "Innisfail", "Olds", "Drayton Valley",
    "Slave Lake", "Peace River", "Whitecourt", "Athabasca", "Bonnyville", "Edson"
  ],
  "British Columbia": [
    "Vancouver", "Surrey", "Burnaby", "Richmond", "Abbotsford", "Coquitlam", "Kelowna",
    "Saanich", "Langley", "Delta", "North Vancouver", "Kamloops", "Nanaimo", "Victoria",
    "Chilliwack", "Prince George", "Vernon", "Courtenay", "Campbell River", "Penticton",
    "Mission", "Maple Ridge", "New Westminster", "Port Coquitlam", "North Cowichan",
    "West Vancouver", "Port Moody", "Cranbrook", "Fort St. John", "Colwood", "Salmon Arm",
    "Parksville", "Castlegar", "Dawson Creek", "Quesnel", "Williams Lake", "Powell River",
    "Duncan", "Terrace", "Kitimat", "Prince Rupert", "Nelson", "Trail", "Revelstoke"
  ],
  "Manitoba": [
    "Winnipeg", "Brandon", "Steinbach", "Thompson", "Portage la Prairie", "Winkler",
    "Selkirk", "Morden", "Dauphin", "The Pas", "Flin Flon", "Swan River", "Neepawa",
    "Virden", "Altona", "Carman", "Stonewall", "Beausejour", "Gimli", "Niverville",
    "Minnedosa", "Roblin", "Killarney", "Souris", "Boissevain", "Russell", "Melita"
  ],
  "New Brunswick": [
    "Saint John", "Moncton", "Fredericton", "Dieppe", "Riverview", "Miramichi",
    "Edmundston", "Quispamsis", "Rothesay", "Bathurst", "Campbellton", "Caraquet",
    "Sussex", "Sackville", "Woodstock", "Grand Falls", "Oromocto", "Dalhousie",
    "Shippagan", "Richibucto", "St. Stephen", "Hampton", "Florenceville-Bristol"
  ],
  "Newfoundland and Labrador": [
    "St. John's", "Mount Pearl", "Corner Brook", "Conception Bay South", "Paradise",
    "Grand Falls-Windsor", "Happy Valley-Goose Bay", "Gander", "Labrador City",
    "Stephenville", "Torbay", "Portugal Cove-St. Philip's", "Bay Roberts", "Clarenville",
    "Carbonear", "Channel-Port aux Basques", "Deer Lake", "Marystown", "Placentia"
  ],
  "Northwest Territories": [
    "Yellowknife", "Hay River", "Inuvik", "Fort Smith", "Behchokǫ̀", "Aklavik",
    "Fort Simpson", "Norman Wells", "Tuktoyaktuk", "Fort McPherson", "Tsiigehtchic",
    "Fort Good Hope", "Tulita", "Deline", "Wekweètì", "Whatì", "Gamètì", "Łutselk'e"
  ],
  "Nova Scotia": [
    "Halifax", "Cape Breton", "Dartmouth", "Sydney", "Truro", "New Glasgow",
    "Glace Bay", "Yarmouth", "Kentville", "Amherst", "Bridgewater", "Antigonish",
    "Wolfville", "Stellarton", "New Waterford", "Windsor", "Westville", "Digby",
    "Oxford", "Mahone Bay", "Liverpool", "Lunenburg", "Pictou", "Annapolis Royal",
    "Berwick", "Clark's Harbour", "Lockeport", "Middleton", "Parrsboro", "Springhill"
  ],
  "Nunavut": [
    "Iqaluit", "Rankin Inlet", "Arviat", "Baker Lake", "Cambridge Bay", "Igloolik",
    "Pangnirtung", "Pond Inlet", "Kugluktuk", "Cape Dorset", "Gjoa Haven", "Taloyoak",
    "Coral Harbour", "Naujaat", "Clyde River", "Hall Beach", "Arctic Bay", "Resolute",
    "Sanikiluaq", "Whale Cove", "Chesterfield Inlet", "Kimmirut", "Qikiqtarjuaq"
  ],
  "Ontario": [
    "Toronto", "Ottawa", "Mississauga", "Brampton", "Hamilton", "London", "Markham", "Vaughan",
    "Kitchener", "Windsor", "Richmond Hill", "Oakville", "Burlington", "Sudbury", "Oshawa",
    "Barrie", "St. Catharines", "Cambridge", "Kingston", "Guelph", "Thunder Bay", "Waterloo",
    "Brantford", "Pickering", "Niagara Falls", "Peterborough", "Sault Ste. Marie", "Sarnia",
    "Ajax", "Milton", "Whitby", "Newmarket", "Belleville", "Welland", "North Bay", "Timmins",
    "Chatham-Kent", "Cornwall", "Stratford", "Orillia", "Orangeville", "Bradford West Gwillimbury",
    "Innisfil", "Tecumseh", "New Tecumseth", "Clarence-Rockland", "Cobourg", "Collingwood",
    "Woodstock", "Fort Erie", "Grimsby", "Leamington", "Lincoln", "Pelham", "Port Colborne",
    "Thorold", "Amherstburg", "Essa", "Georgina", "Halton Hills", "LaSalle", "Norfolk County",
    "Wasaga Beach", "Elliot Lake", "Hawkesbury", "Iroquois Falls", "Kapuskasing", "Kenora"
  ],
  "Prince Edward Island": [
    "Charlottetown", "Summerside", "Stratford", "Cornwall", "Montague", "Kensington",
    "Souris", "Alberton", "Georgetown", "Tignish", "Borden-Carleton", "O'Leary",
    "Wellington", "Crapaud", "Hunter River", "Miltonvale Park", "North Rustico",
    "Victoria", "Brackley", "Cavendish", "Morell", "Murray River", "Three Rivers"
  ],
  "Quebec": [
    "Montreal", "Quebec City", "Laval", "Gatineau", "Longueuil", "Sherbrooke", "Saguenay",
    "Trois-Rivières", "Terrebonne", "Saint-Jean-sur-Richelieu", "Repentigny", "Brossard",
    "Drummondville", "Saint-Jérôme", "Granby", "Blainville", "Saint-Hyacinthe", "Shawinigan",
    "Dollard-des-Ormeaux", "Rimouski", "Châteauguay", "Saint-Eustache", "Mascouche", "Lévis",
    "Victoriaville", "Rouyn-Noranda", "Mirabel", "Joliette", "Sorel-Tracy", "Vaudreuil-Dorion",
    "Val-d'Or", "Thetford Mines", "Sept-Îles", "Alma", "Beauport", "Boucherville", "Magog",
    "Saint-Georges", "Chicoutimi", "Beloeil", "Sainte-Julie", "Saint-Bruno-de-Montarville",
    "McMasterville", "Varennes", "La Prairie", "Candiac", "Delson", "Saint-Constant"
  ],
  "Saskatchewan": [
    "Saskatoon", "Regina", "Prince Albert", "Moose Jaw", "Swift Current", "Yorkton",
    "North Battleford", "Estevan", "Weyburn", "Lloydminster", "Martensville", "Warman",
    "Meadow Lake", "Kindersley", "Melfort", "Humboldt", "Tisdale", "Melville", "Canora",
    "Rosetown", "Unity", "Outlook", "Watrous", "Carlyle", "Esterhazy", "Foam Lake",
    "Hudson Bay", "Kamsack", "Kerrobert", "Lanigan", "Nipawin", "Preeceville", "Wadena"
  ],
  "Yukon": [
    "Whitehorse", "Dawson City", "Watson Lake", "Haines Junction", "Mayo", "Carmacks",
    "Faro", "Ross River", "Teslin", "Beaver Creek", "Destruction Bay", "Pelly Crossing",
    "Old Crow", "Eagle Plains", "Swift River", "Champagne", "Burwash Landing"
  ]
};

// Service categories available in the marketplace
const serviceCategories = [
  "Appliance Repair",
  "Carpentry",
  "Cleaning",
  "Electrical",
  "Flooring",
  "HVAC",
  "Inspections",
  "Landscaping",
  "Moving",
  "Painting",
  "Plumbing",
  "Roofing",
  "Security",
  "Windows & Doors"
];

const VendorProfilePage = () => {
  const [profileData, setProfileData] = useState({
    business_name: "",
    contact_name: "",
    phone: "",
    business_address: "",
    city: "",
    province: "",
    postal_code: "",
    description: "",
    website_url: "",
    service_areas: [] as string[],
    business_license: "",
    insurance_info: "",
  });

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [vendorProfile, setVendorProfile] = useState<any>(null);

  // Load vendor profile on component mount
  useEffect(() => {
    loadVendorProfile();
  }, []);

  const loadVendorProfile = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await VendorAuthAPI.getProfile();

      if (response.error) {
        setError(response.message || "Failed to load vendor profile");
        return;
      }

      if (response.vendor) {
        setVendorProfile(response.vendor);
        setProfileData({
          business_name: response.vendor.business_name || "",
          contact_name: response.vendor.contact_name || "",
          phone: response.vendor.phone || "",
          business_address: response.vendor.business_address || "",
          city: response.vendor.city || "",
          province: response.vendor.province || "",
          postal_code: response.vendor.postal_code || "",
          description: response.vendor.description || "",
          website_url: response.vendor.website_url || "",
          service_areas: response.vendor.service_areas || [],
          business_license: response.vendor.business_license || "",
          insurance_info: response.vendor.insurance_info || "",
        });
        setSelectedProvince(response.vendor.province || "");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load vendor profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      setError("");

      const updateData: UpdateVendorProfileData = {
        business_name: profileData.business_name,
        contact_name: profileData.contact_name,
        phone: profileData.phone,
        business_address: profileData.business_address,
        city: profileData.city,
        province: profileData.province,
        postal_code: profileData.postal_code,
        description: profileData.description,
        website_url: profileData.website_url,
        service_areas: profileData.service_areas,
        business_license: profileData.business_license,
        insurance_info: profileData.insurance_info,
      };

      const response = await VendorAuthAPI.updateProfile(updateData);

      if (response.error) {
        setError(response.message);
        showError(response.message);
        return;
      }

      showSuccess("Company profile saved successfully!");
      // Reload profile to get updated data
      await loadVendorProfile();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to save profile";
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addCity = () => {
    if (selectedCity && !profileData.service_areas.includes(selectedCity)) {
      setProfileData(prev => ({
        ...prev,
        service_areas: [...prev.service_areas, selectedCity]
      }));
      setSelectedCity("");
      showSuccess(`${selectedCity} added to your service cities!`);
    } else if (profileData.service_areas.includes(selectedCity)) {
      showError("This city is already in your service list!");
    } else {
      showError("Please select a city first!");
    }
  };

  const removeCity = (city: string) => {
    setProfileData(prev => ({
      ...prev,
      service_areas: prev.service_areas.filter(a => a !== city)
    }));
    showSuccess(`${city} removed from your service cities!`);
  };

  // Show loading skeleton while data is being fetched
  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Company Profile</h1>
          <p className="text-gray-600 mt-1">
            Manage your business information and how customers see your company.
          </p>
        </div>
        <Button
          onClick={handleSaveProfile}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-blue-600" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Your company's core details that customers will see first.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="business-name">Business Name *</Label>
                <Input
                  id="business-name"
                  type="text"
                  placeholder="Your Business Name"
                  value={profileData.business_name}
                  onChange={(e) => handleInputChange('business_name', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="contact-name">Contact Name *</Label>
                <Input
                  id="contact-name"
                  type="text"
                  placeholder="Your Full Name"
                  value={profileData.contact_name}
                  onChange={(e) => handleInputChange('contact_name', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="business-description">Business Description *</Label>
                <Textarea
                  id="business-description"
                  placeholder="Tell customers about your business and what makes you special..."
                  rows={4}
                  value={profileData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-blue-600" />
                Contact Information
              </CardTitle>
              <CardDescription>
                How customers can reach you for inquiries and bookings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="contact-phone">Phone Number *</Label>
                <Input
                  id="contact-phone"
                  type="tel"
                  placeholder="(123) 456-7890"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="business-website">Website URL</Label>
                <Input
                  id="business-website"
                  type="url"
                  placeholder="https://www.yourbusiness.com"
                  value={profileData.website_url}
                  onChange={(e) => handleInputChange('website_url', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="business-address">Business Address</Label>
                <Input
                  id="business-address"
                  type="text"
                  placeholder="123 Main Street"
                  value={profileData.business_address}
                  onChange={(e) => handleInputChange('business_address', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="Toronto"
                    value={profileData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="province">Province</Label>
                  <Input
                    id="province"
                    type="text"
                    placeholder="Ontario"
                    value={profileData.province}
                    onChange={(e) => handleInputChange('province', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="postal-code">Postal Code</Label>
                  <Input
                    id="postal-code"
                    type="text"
                    placeholder="M5V 3A8"
                    value={profileData.postal_code}
                    onChange={(e) => handleInputChange('postal_code', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Business Details
              </CardTitle>
              <CardDescription>
                Additional information that builds trust with customers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="business-license">Business License Number</Label>
                <Input
                  id="business-license"
                  type="text"
                  placeholder="Enter your business license number"
                  value={profileData.business_license}
                  onChange={(e) => handleInputChange('business_license', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="insurance-info">Insurance Information</Label>
                <Textarea
                  id="insurance-info"
                  placeholder="Provide details about your business insurance coverage..."
                  rows={3}
                  value={profileData.insurance_info}
                  onChange={(e) => handleInputChange('insurance_info', e.target.value)}
                />
              </div>
              {/* <div>
                <Label htmlFor="team-size">Team Size</Label>
                <Input
                  id="team-size"
                  type="text"
                  placeholder="5"
                  value={profileData.teamSize}
                  onChange={(e) => handleInputChange('teamSize', e.target.value)}
                />
              </div> */}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-600" />
                Profile Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Building className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg">{profileData.business_name || "Your Business"}</h3>
                <p className="text-sm text-gray-600">{profileData.contact_name || "Business Owner"}</p>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{profileData.phone || "No phone number"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{profileData.city && profileData.province ? `${profileData.city}, ${profileData.province}` : "No location set"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Building className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{profileData.service_areas.length} service cities</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Cities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Service Cities
              </CardTitle>
              <CardDescription>
                Cities where you provide services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {profileData.service_areas.map((city, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-red-100 hover:text-red-700"
                    onClick={() => removeCity(city)}
                  >
                    {city} ×
                  </Badge>
                ))}
                {profileData.service_areas.length === 0 && (
                  <p className="text-sm text-gray-500">No service cities added yet</p>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="province-select">Province/State</Label>
                  <Select value={selectedProvince} onValueChange={setSelectedProvince}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(citiesByProvince).map((province) => (
                        <SelectItem key={province} value={province}>
                          {province}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="city-select">City</Label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {citiesByProvince[selectedProvince as keyof typeof citiesByProvince]?.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={addCity}
                  className="w-full"
                  disabled={!selectedCity}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add City
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="/vendor-portal/services">
                  <Building className="mr-2 h-4 w-4" />
                  Manage Services
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="/vendor-portal/referrals">
                  <Award className="mr-2 h-4 w-4" />
                  View Referrals
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="/vendor-portal/subscription">
                  <Users className="mr-2 h-4 w-4" />
                  Subscription
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VendorProfilePage;