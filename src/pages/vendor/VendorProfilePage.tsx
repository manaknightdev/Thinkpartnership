import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Building, Mail, Phone, Globe, MapPin, Clock, Award, Users, Plus } from "lucide-react";
import { toast } from "sonner";
import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

const VendorProfilePage = () => {
  const [profileData, setProfileData] = useState({
    companyName: "Rapid Plumbers",
    companyBio: "Rapid Plumbers provides 24/7 emergency plumbing services, leak detection, drain cleaning, and water heater installations. We are committed to fast, reliable, and high-quality service.",
    contactEmail: "info@rapidplumbers.com",
    contactPhone: "(555) 123-4567",
    website: "https://www.rapidplumbers.com",
    address: "123 Main Street, Anytown, ST 12345",
    businessHours: "7 days in a week",
    yearsInBusiness: "15",
    teamSize: "12",
    serviceAreas: ["Toronto", "Mississauga", "Brampton"],
  });

  const [selectedProvince, setSelectedProvince] = useState("Ontario");
  const [selectedCity, setSelectedCity] = useState("");


  const handleSaveProfile = () => {
    toast.success("Company profile saved successfully!");
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addCity = () => {
    if (selectedCity && !profileData.serviceAreas.includes(selectedCity)) {
      setProfileData(prev => ({
        ...prev,
        serviceAreas: [...prev.serviceAreas, selectedCity]
      }));
      setSelectedCity("");
      toast.success(`${selectedCity} added to your service cities!`);
    } else if (profileData.serviceAreas.includes(selectedCity)) {
      toast.error("This city is already in your service list!");
    } else {
      toast.error("Please select a city first!");
    }
  };

  const removeCity = (city: string) => {
    setProfileData(prev => ({
      ...prev,
      serviceAreas: prev.serviceAreas.filter(a => a !== city)
    }));
    toast.success(`${city} removed from your service cities!`);
  };

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
        <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-700">
          Save Changes
        </Button>
      </div>

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
                <Label htmlFor="company-name">Company Name *</Label>
                <Input
                  id="company-name"
                  type="text"
                  placeholder="Your Company Name"
                  value={profileData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="company-bio">Company Description *</Label>
                <Textarea
                  id="company-bio"
                  placeholder="Tell customers about your company and what makes you special..."
                  rows={4}
                  value={profileData.companyBio}
                  onChange={(e) => handleInputChange('companyBio', e.target.value)}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact-email">Business Email *</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="contact@yourcompany.com"
                    value={profileData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contact-phone">Phone Number *</Label>
                  <Input
                    id="contact-phone"
                    type="tel"
                    placeholder="(123) 456-7890"
                    value={profileData.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="company-website">Website URL</Label>
                <Input
                  id="company-website"
                  type="url"
                  placeholder="https://www.yourcompany.com"
                  value={profileData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="business-address">Business Address</Label>
                <Input
                  id="business-address"
                  type="text"
                  placeholder="123 Main Street, City, State, ZIP"
                  value={profileData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="business-hours">Business Hours</Label>
                  <Input
                    id="business-hours"
                    type="text"
                    placeholder="Mon-Fri 9AM-5PM"
                    value={profileData.businessHours}
                    onChange={(e) => handleInputChange('businessHours', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="years-in-business">Years in Business</Label>
                  <Input
                    id="years-in-business"
                    type="text"
                    placeholder="5"
                    value={profileData.yearsInBusiness}
                    onChange={(e) => handleInputChange('yearsInBusiness', e.target.value)}
                  />
                </div>
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
                <h3 className="font-semibold text-lg">{profileData.companyName}</h3>
                <p className="text-sm text-gray-600">Professional Service Provider</p>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{profileData.yearsInBusiness} years in business</span>
                </div>
                {/* <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{profileData.teamSize} team members</span>
                </div> */}
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Multiple service cities</span>
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
                {profileData.serviceAreas.map((city, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-red-100 hover:text-red-700"
                    onClick={() => removeCity(city)}
                  >
                    {city} ×
                  </Badge>
                ))}
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