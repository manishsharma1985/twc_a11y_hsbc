
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Check, Home, Activity } from 'lucide-react';
import Header from '@/components/Header';

const SuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={user}
        isAuthenticated={isAuthenticated}
      />
      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <Check className="h-10 w-10 text-green-600" aria-hidden="true" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Request Submitted Successfully
          </h2>
          
          <p className="text-lg text-gray-600 mb-8">
            We've received your request{user?.name ? `, ${user.name}` : ''}! One of our team members will contact you shortly 
            to help you with the next steps.
          </p>
        </div>

        {/* Success Details Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Activity className="h-5 w-5 mr-2 text-primary" aria-hidden="true" />
              What Happens Next?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                1
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Review & Processing</h4>
                <p className="text-sm text-gray-600">
                  Our team will review your request and prepare the necessary arrangements.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                2
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Personal Contact</h4>
                <p className="text-sm text-gray-600">
                  A team member will reach out via your preferred contact method within 24 hours.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                3
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Guided Assistance</h4>
                <p className="text-sm text-gray-600">
                  We'll guide you through each step and ensure you receive the support you need.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Activity className="h-4 w-4 text-blue-600" aria-hidden="true" />
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Track Your Request</h4>
                <p className="text-sm text-gray-600 mb-3">
                  You can track the status of your request anytime from the homepage or 
                  your request history page.
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Need immediate assistance?</strong> Our support team is available 
                  to help you with any urgent needs or questions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate('/')}
            size="lg"
            className="flex items-center"
            aria-label="Return to homepage"
          >
            <Home className="h-4 w-4 mr-2" aria-hidden="true" />
            Go to Homepage
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => navigate('/history')}
            size="lg"
            className="flex items-center"
            aria-label="View request status and history"
          >
            <Activity className="h-4 w-4 mr-2" aria-hidden="true" />
            Track Request Status
          </Button>
        </div>

        {/* Contact Information */}
        <div className="mt-12 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Need Help or Have Questions?
          </h3>
          <p className="text-gray-600 mb-4">
            Our support team is here to assist you every step of the way.
          </p>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <strong>Email:</strong> support@healthwellnesshub.com
            </p>
            <p>
              <strong>Phone:</strong> 1-800-WELLNESS (1-800-935-5637)
            </p>
            <p>
              <strong>Hours:</strong> Monday - Friday, 8:00 AM - 6:00 PM
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SuccessPage;
