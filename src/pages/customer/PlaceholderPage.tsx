import { MarketplaceLayout } from "@/components/MarketplaceLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

const PlaceholderPage = ({ title, description }: PlaceholderPageProps) => {
  const navigate = useNavigate();

  return (
    <MarketplaceLayout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <Card className="border-0 shadow-xl bg-white rounded-2xl">
            <CardContent className="p-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Construction className="w-10 h-10 text-green-600" />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {title}
              </h1>
              
              <p className="text-lg text-gray-600 mb-8">
                {description}
              </p>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  This page is currently under development. We're working hard to bring you amazing features!
                </p>
                
                <Button 
                  onClick={() => navigate('/marketplace')}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8 py-3"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Marketplace
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MarketplaceLayout>
  );
};

export default PlaceholderPage;
