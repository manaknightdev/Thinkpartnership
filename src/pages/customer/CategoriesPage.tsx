import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketplaceLayout } from "@/components/MarketplaceLayout";
import {
  Search,
  Home,
  Wrench,
  Paintbrush,
  Leaf,
  Lightbulb,
  Truck,
  Building2,
  CheckCircle,
  Car,
  Hammer,
  Shield,
  Camera,
  Laptop,
  Heart,
  Baby,
  GraduationCap,
  Utensils,
  Dumbbell,
  Music,
  Scissors,
  ArrowRight,
  Filter,
  Grid3X3,
  List
} from "lucide-react";

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const allCategories = [
    // Automotive (alphabetical)
    { name: "Auto Repair", icon: Car, count: 16, color: "bg-blue-600", description: "Mechanical, electrical repairs", category: "automotive" },
    { name: "Car Detailing", icon: Car, count: 11, color: "bg-cyan-500", description: "Washing, waxing, interior", category: "automotive" },

    // Events & Entertainment (alphabetical)
    { name: "Catering", icon: Utensils, count: 12, color: "bg-orange-600", description: "Events, parties, corporate", category: "events" },
    { name: "Music Lessons", icon: Music, count: 15, color: "bg-purple-600", description: "Instruments, voice, theory", category: "events" },

    // Home Services (alphabetical)
    { name: "Cleaning", icon: CheckCircle, count: 32, color: "bg-green-500", description: "Deep clean, maintenance", category: "home" },
    { name: "Electrical", icon: Lightbulb, count: 18, color: "bg-yellow-500", description: "Wiring, outlets, lighting", category: "home" },
    { name: "Handyman", icon: Hammer, count: 28, color: "bg-gray-600", description: "General repairs, maintenance", category: "home" },
    { name: "HVAC", icon: Home, count: 12, color: "bg-orange-500", description: "Heating, cooling, ventilation", category: "home" },
    { name: "Inspections", icon: Building2, count: 9, color: "bg-indigo-500", description: "Home, safety, compliance", category: "home" },
    { name: "Landscaping", icon: Leaf, count: 15, color: "bg-emerald-500", description: "Lawn care, garden design", category: "home" },
    { name: "Moving", icon: Truck, count: 8, color: "bg-red-500", description: "Relocation, packing, storage", category: "home" },
    { name: "Painting", icon: Paintbrush, count: 21, color: "bg-purple-500", description: "Interior, exterior, touch-ups", category: "home" },
    { name: "Plumbing", icon: Wrench, count: 24, color: "bg-blue-500", description: "Pipes, leaks, installations", category: "home" },
    { name: "Security", icon: Shield, count: 14, color: "bg-slate-600", description: "Alarms, cameras, locks", category: "home" },

    // Personal Services (alphabetical)
    { name: "Childcare", icon: Baby, count: 13, color: "bg-yellow-400", description: "Babysitting, nanny services", category: "personal" },
    { name: "Hair & Beauty", icon: Scissors, count: 26, color: "bg-pink-600", description: "Styling, cuts, treatments", category: "personal" },
    { name: "Health & Wellness", icon: Heart, count: 25, color: "bg-red-400", description: "Fitness, therapy, nutrition", category: "personal" },
    { name: "Personal Training", icon: Dumbbell, count: 20, color: "bg-green-600", description: "Fitness, nutrition, coaching", category: "personal" },
    { name: "Tutoring", icon: GraduationCap, count: 17, color: "bg-blue-400", description: "Academic, test prep, skills", category: "personal" },

    // Technology (alphabetical)
    { name: "Computer Repair", icon: Laptop, count: 19, color: "bg-gray-700", description: "Hardware, software, networking", category: "technology" },
    { name: "Photography", icon: Camera, count: 22, color: "bg-pink-500", description: "Events, portraits, commercial", category: "technology" },
  ];

  const categoryFilters = [
    { id: "all", name: "All Categories", count: allCategories.length },
    { id: "home", name: "Home Services", count: allCategories.filter(c => c.category === "home").length },
    { id: "automotive", name: "Automotive", count: allCategories.filter(c => c.category === "automotive").length },
    { id: "technology", name: "Technology", count: allCategories.filter(c => c.category === "technology").length },
    { id: "personal", name: "Personal Services", count: allCategories.filter(c => c.category === "personal").length },
    { id: "events", name: "Events & Entertainment", count: allCategories.filter(c => c.category === "events").length },
  ];

  const filteredCategories = allCategories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === "all" || category.category === selectedFilter;
    return matchesSearch && matchesFilter;
  }).sort((a, b) => a.name.localeCompare(b.name));

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/marketplace?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <MarketplaceLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <section className="bg-white border-b border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Browse All Categories
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover services across all categories. Find the perfect professional for any task.
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>

            {/* Filters and View Toggle */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {categoryFilters.map((filter) => (
                  <Button
                    key={filter.id}
                    variant={selectedFilter === filter.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFilter(filter.id)}
                    className={selectedFilter === filter.id ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    {filter.name} ({filter.count})
                  </Button>
                ))}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">View:</span>
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Grid/List */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredCategories.length} categories
                {searchTerm && ` for "${searchTerm}"`}
                {selectedFilter !== "all" && ` in ${categoryFilters.find(f => f.id === selectedFilter)?.name}`}
              </p>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredCategories.map((category) => (
                  <Card 
                    key={category.name} 
                    className="group cursor-pointer transition-all duration-500 hover:shadow-2xl border-0 bg-white hover:bg-gradient-to-br hover:from-white hover:to-gray-50 rounded-2xl overflow-hidden"
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                        <category.icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2 text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">
                        {category.description}
                      </p>
                      <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                        {category.count} services
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCategories.map((category) => (
                  <Card 
                    key={category.name}
                    className="group cursor-pointer transition-all duration-300 hover:shadow-lg border border-gray-200 hover:border-green-300"
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <category.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-green-600 transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {category.description}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                            {category.count} services
                          </Badge>
                          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {filteredCategories.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No categories found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </MarketplaceLayout>
  );
};

export default CategoriesPage;
