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
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing your login...');

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
          // Check if this is a client selection scenario
          if (authData.action === 'select_client' && authData.available_clients) {
            console.log('🔄 Redirecting to client selection page');
            navigate(`/marketplace/select-client?data=${encodeURIComponent(data)}`);
            return;
          }

          // Check if this is a require invite scenario
          if (authData.action === 'require_invite') {
            setStatus('error');
            setMessage(authData.message || 'You must register through a valid client referral link.');
            showError(authData.message || 'Social login requires a client invitation');
            return;
          }

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

          setStatus('success');
          setMessage('Login successful! Redirecting to marketplace...');
          showSuccess('Welcome! You have been successfully logged in.');

          // Redirect to marketplace after a short delay
          setTimeout(() => {
            navigate('/marketplace');
          }, 2000);
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
