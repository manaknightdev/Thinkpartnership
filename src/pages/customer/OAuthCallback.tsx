import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MarketplaceAuthAPI from '@/services/MarketplaceAuthAPI';
import { showSuccess, showError } from '@/utils/toast';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'choose-client'>('loading');
  const [message, setMessage] = useState('Processing your login...');
  const [clients, setClients] = useState<Array<{ id: number; company_name: string; subdomain?: string; logo_url?: string }>>([]);
  const [attaching, setAttaching] = useState(false);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get the data parameter from URL
        const data = searchParams.get('data');
        
        if (!data) {
          throw new Error('No authentication data received');
        }

        // Decode the data
        const decodedData = decodeURIComponent(data);
        const authData = JSON.parse(decodedData);

        console.log('🔐 OAuth callback data:', authData);

        if (authData.error) {
          throw new Error(authData.message || 'Social login failed');
        }

        // Store the authentication data
        if (authData.token && authData.user_id) {
          const authResponse = {
            error: false,
            token: authData.token,
            refresh_token: authData.refresh_token,
            user_id: authData.user_id,
            role: authData.role,
            expire_at: authData.expire_at
          };

          MarketplaceAuthAPI.storeAuthData(authResponse);

          // Fetch profile to see if user is already attached to a client
          const profile = await MarketplaceAuthAPI.getProfile();
          const hasClient = !!profile.user?.client_id || !!profile.user?.customer_id;

          if (hasClient) {
            setStatus('success');
            setMessage('Login successful! Redirecting to marketplace...');
            showSuccess('Welcome! You have been successfully logged in.');
            setTimeout(() => navigate('/marketplace'), 1200);
          } else {
            // No client association; prompt to choose a client
            const res = await MarketplaceAuthAPI.listClients();
            if (!res.error && res.clients?.length) {
              setClients(res.clients);
              setStatus('choose-client');
              setMessage('Select a client to join');
            } else {
              setStatus('success');
              setMessage('Login successful! Redirecting to marketplace...');
              setTimeout(() => navigate('/marketplace'), 1200);
            }
          }
        } else {
          throw new Error('Invalid authentication response');
        }

      } catch (error: any) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setMessage(error.message || 'Login failed. Please try again.');
        showError(error.message || 'Social login failed');
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate]);

  const handleRetry = () => {
    navigate('/marketplace/login');
  };

  const handleAttach = async (clientId: number) => {
    try {
      setAttaching(true);
      const result = await MarketplaceAuthAPI.attachToClient(clientId);
      if (result.error) {
        showError(result.message || 'Failed to attach to client');
        setAttaching(false);
        return;
      }
      showSuccess('Client selected successfully');
      navigate('/marketplace');
    } catch (e: any) {
      showError(e?.message || 'Failed to attach to client');
      setAttaching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-bold">
            {status === 'loading' && 'Processing Login'}
            {status === 'success' && 'Login Successful'}
            {status === 'error' && 'Login Failed'}
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center space-y-6">
          {status === 'loading' && (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
              <p className="text-gray-600">{message}</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-gray-600">{message}</p>
            </div>
          )}

          {status === 'choose-client' && (
            <div className="space-y-4">
              <p className="text-gray-700">{message}</p>
              <div className="grid grid-cols-1 gap-3">
                {clients.map((c) => (
                  <Button
                    key={c.id}
                    variant="outline"
                    className="justify-start"
                    disabled={attaching}
                    onClick={() => handleAttach(c.id)}
                  >
                    {c.logo_url ? (
                      <img src={c.logo_url} alt={c.company_name} className="w-6 h-6 mr-2 rounded" />
                    ) : null}
                    {c.company_name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-gray-600 mb-4">{message}</p>
              <Button 
                onClick={handleRetry}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OAuthCallback;
