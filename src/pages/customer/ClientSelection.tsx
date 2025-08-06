import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowRight, Building2, Users, Loader2 } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

interface ClientOption {
  id: number;
  name: string;
  invite_code: string;
}

interface OAuthData {
  error: boolean;
  message: string;
  action?: string;
  available_clients?: ClientOption[];
  user_email?: string;
  auth_provider?: string;
}

const ClientSelection = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientOption | null>(null);
  const [oauthData, setOauthData] = useState<OAuthData | null>(null);

  useEffect(() => {
    // Parse OAuth data from URL parameters
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const decodedData = decodeURI(dataParam);
        const parsedData: OAuthData = JSON.parse(decodedData);
        
        if (parsedData.action === 'select_client' && parsedData.available_clients) {
          setOauthData(parsedData);
        } else {
          showError('Invalid client selection data');
          navigate('/marketplace/login');
        }
      } catch (error) {
        console.error('Error parsing OAuth data:', error);
        showError('Invalid data format');
        navigate('/marketplace/login');
      }
    } else {
      // No data parameter - redirect to login
      navigate('/marketplace/login');
    }
  }, [searchParams, navigate]);

  const handleClientSelection = async (client: ClientOption) => {
    if (!oauthData) return;

    setIsLoading(true);
    setSelectedClient(client);

    try {
      // Redirect to the appropriate registration page with the client invite code
      const registrationUrl = `/marketplace/register?ref=${client.invite_code}&client=${client.id}&provider=${oauthData.auth_provider}`;
      
      showSuccess(`Joining ${client.name}...`);
      navigate(registrationUrl);
    } catch (error) {
      console.error('Error selecting client:', error);
      showError('Failed to join client. Please try again.');
    } finally {
      setIsLoading(false);
      setSelectedClient(null);
    }
  };

  const handleBackToLogin = () => {
    navigate('/marketplace/login');
  };

  if (!oauthData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Select a Client</h1>
          <p className="text-gray-600">
            Choose which marketplace you'd like to join
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center">Available Marketplaces</CardTitle>
            <CardDescription className="text-center text-gray-600">
              {oauthData.auth_provider && (
                <>Your {oauthData.auth_provider} account needs to be associated with a marketplace.</>
              )}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {oauthData.message && (
              <Alert className="mb-6">
                <AlertDescription>{oauthData.message}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              {oauthData.available_clients?.map((client) => (
                <Card 
                  key={client.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-200"
                  onClick={() => handleClientSelection(client)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <Building2 className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {client.name}
                          </h3>
                          <p className="text-sm text-gray-500 flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            Marketplace Platform
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {isLoading && selectedClient?.id === client.id ? (
                          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                        ) : (
                          <ArrowRight className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Back to Login Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleBackToLogin}
                disabled={isLoading}
              >
                Back to Login
              </Button>
            </div>

            {/* Help Text */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Don't see your marketplace? Contact your administrator for an invite link.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientSelection;
