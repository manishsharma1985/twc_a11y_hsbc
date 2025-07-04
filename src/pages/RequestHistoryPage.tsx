
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/contexts/AuthContext';
import { useRequests, HealthRequest } from '@/contexts/RequestContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Phone,
  Mail,
  Calendar,
  Plus,
  List
} from 'lucide-react';

const getStatusIcon = (status: HealthRequest['status']) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4" aria-hidden="true" />;
    case 'in-progress':
      return <AlertCircle className="h-4 w-4" aria-hidden="true" />;
    case 'completed':
      return <CheckCircle className="h-4 w-4" aria-hidden="true" />;
    case 'cancelled':
      return <XCircle className="h-4 w-4" aria-hidden="true" />;
    default:
      return <Clock className="h-4 w-4" aria-hidden="true" />;
  }
};

const getStatusColor = (status: HealthRequest['status']) => {
  switch (status) {
    case 'pending':
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2';
    case 'in-progress':
      return 'bg-blue-100 text-blue-800 hover:bg-blue-200 focus:bg-blue-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
    case 'completed':
      return 'bg-green-100 text-green-800 hover:bg-green-200 focus:bg-green-200 focus:ring-2 focus:ring-green-500 focus:ring-offset-2';
    case 'cancelled':
      return 'bg-red-100 text-red-800 hover:bg-red-200 focus:bg-red-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2';
    default:
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2';
  }
};

const getContactMethodIcon = (method: HealthRequest['contactMethod']) => {
  switch (method) {
    case 'phone':
      return <Phone className="h-4 w-4" aria-hidden="true" />;
    case 'email':
      return <Mail className="h-4 w-4" aria-hidden="true" />;
    case 'video':
      return <Calendar className="h-4 w-4" aria-hidden="true" />;
    default:
      return <Mail className="h-4 w-4" aria-hidden="true" />;
  }
};

const RequestHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { requests, updateRequestStatus } = useRequests();
  const { toast } = useToast();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to view your request history.",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [isAuthenticated, navigate, toast]);

  const handleFollowUp = (requestId: string) => {
    toast({
      title: "Follow-up Request Noted",
      description: "Our team will contact you shortly regarding this request.",
    });
  };

  const handleViewDetails = (request: HealthRequest) => {
    toast({
      title: "Request Details",
      description: `Service: ${request.service}\nStatus: ${request.status}\nContact: ${request.contactMethod}`,
    });
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Same as HomePage */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1140px] mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/81eef39a-e573-4fd1-9023-d796f35d9e41.png" 
                alt="The Wellness Corner"
                className="h-10 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => navigate('/')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate('/');
                  }
                }}
              />
            </div>
            
            <nav className="flex items-center space-x-6">
              {isAuthenticated ? (
                <div className="flex items-center space-x-6">
                  {/* <img 
                    src="/lovable-uploads/6f5eb287-817a-4b58-b231-56d3e2983585.png" 
                    alt="Accenture"
                    className="h-6"
                  /> */}
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate('/history')}
                    className="flex items-center text-gray-600 hover:text-primary"
                  >
                    <List className="h-4 w-4 mr-2" />
                    View All Requests
                  </Button>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button 
                        className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full"
                        aria-label="User menu"
                      >
                        <Avatar className="h-10 w-10 cursor-pointer bg-primary/10 border-2 border-primary/20 hover:bg-primary/20 transition-colors">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                            {user ? getUserInitials(user.name) : 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 p-3" align="end">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                          <p className="text-xs text-gray-500 break-all">{user?.email}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={logout}
                          className="w-full text-sm"
                        >
                          Sign Out
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              ) : (
                <Button 
                  onClick={() => navigate('/login')}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  Login
                </Button>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1140px] mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Your Previous Requests
            </h2>
            <p className="text-gray-600">
              Track the status of your health and wellness service requests
            </p>
          </div>
          
          <Button 
            onClick={() => navigate('/request')}
            className="flex items-center"
            aria-label="Submit a new service request"
          >
            <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
            New Request
          </Button>
        </div>

        {/* Request List */}
        {requests.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-gray-400" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Requests Yet
              </h3>
              <p className="text-gray-600 mb-6">
                You haven't submitted any service requests yet. 
                Start by submitting your first request.
              </p>
              <Button onClick={() => navigate('/request')}>
                Submit Your First Request
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {requests.map((request) => (
              <Card key={request.id} className="hover:shadow-md transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center text-lg">
                      {getStatusIcon(request.status)}
                      <span className="ml-2">{request.service}</span>
                    </CardTitle>
                    <Badge 
                      className={`${getStatusColor(request.status)} transition-colors focus:outline-none`}
                      tabIndex={0}
                      role="status"
                      aria-label={`Request status: ${request.status === 'in-progress' ? 'In Progress - Your request is currently being reviewed and processed' : request.status === 'completed' ? 'Completed - Your request has been successfully fulfilled' : request.status === 'cancelled' ? 'Cancelled - This request has been cancelled' : 'Pending - Your request is waiting to be processed'}`}
                    >
                      {request.status.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Request Details */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Request Details</h4>
                      <p className="text-gray-600 text-sm">
                        {request.details || `Request for ${request.service}`}
                      </p>
                    </div>

                    {/* Additional Requirements */}
                    {request.additionalRequirements && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Additional Requirements</h4>
                        <p className="text-gray-600 text-sm">
                          {request.additionalRequirements}
                        </p>
                      </div>
                    )}

                    {/* Request Metadata */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        {getContactMethodIcon(request.contactMethod)}
                        <span className="ml-1">
                          Contact via {request.contactMethod}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" aria-hidden="true" />
                        <span>
                          Submitted {request.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                      
                      {request.updatedAt.getTime() !== request.createdAt.getTime() && (
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" aria-hidden="true" />
                          <span>
                            Updated {request.updatedAt.toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Accessibility Badge */}
                    {request.needsAccessibilityAssistance && (
                      <Badge variant="outline" className="w-fit">
                        Accessibility assistance requested
                      </Badge>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(request)}
                        aria-label={`View details for ${request.service} request`}
                      >
                        View Details
                      </Button>
                      
                      {(request.status === 'pending' || request.status === 'in-progress') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFollowUp(request.id)}
                          aria-label={`Request follow-up for ${request.service}`}
                        >
                          Request Follow-Up
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Support Information */}
        <Card className="mt-12 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg">Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              If you have questions about any of your requests or need immediate assistance, 
              our support team is here to help.
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
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm text-gray-600 hover:text-gray-900 focus:outline-none focus:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
};

export default RequestHistoryPage;
