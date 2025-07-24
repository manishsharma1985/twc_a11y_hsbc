
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
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
import { getAllRequests, HealthBenefitRequest } from '@/lib/supabase';
import Header from '@/components/Header';

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
  const { toast } = useToast();

  const [requests, setRequests] = React.useState<HealthRequest[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const paginatedRequests = requests.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Fetch all requests from Supabase on mount
  React.useEffect(() => {
    if (!isAuthenticated) return;
    setLoading(true);
    getAllRequests()
      .then((data: HealthBenefitRequest[] = []) => {
        // Map Supabase data to HealthRequest[]
        const mapped = data.map((item) => ({
          id: item.id || Math.random().toString(),
          service: item.service,
          details: item.description || `Request for ${item.service}`,
          contactMethod: item.contact_method as 'phone' | 'email' | 'video',
          additionalRequirements: '',
          needsAccessibilityAssistance: false, // Not tracked in DB
          status: (item.status as HealthRequest['status']) || 'pending',
          createdAt: item.created_at ? new Date(item.created_at) : new Date(),
          updatedAt: item.updated_at ? new Date(item.updated_at) : (item.created_at ? new Date(item.created_at) : new Date()),
          fullName: item.full_name,
          email: item.email,
          phoneNumber: item.phone_number,
        }));
        setRequests(mapped);
      })
      .catch((error) => {
        toast({
          title: 'Error loading requests',
          description: 'Could not fetch requests from the server.',
          variant: 'destructive',
        });
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated, toast]);

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
      <Header
        user={user}
        isAuthenticated={isAuthenticated}
        logout={logout}
      />
      {/* Main Content */}
      <main id="main-content" className="max-w-[1140px] mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
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
            className="flex items-center w-full sm:w-auto mt-4 sm:mt-0"
            aria-label="Submit a new service request"
          >
            <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
            New Request
          </Button>
        </div>

        {/* Request List */}
        {loading ? (
          <Card><CardContent className="text-center py-12">Loading requests...</CardContent></Card>
        ) : requests.length === 0 ? (
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
          <>
            <div className="space-y-6">
              {paginatedRequests.map((request, idx) => (
                <Card key={request.id} className="hover:shadow-md transition-shadow duration-200">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(request.status)}
                        <span className="ml-2 text-lg font-semibold">{request.service}</span>
                      </div>
                      <Badge 
                        className={`${getStatusColor(request.status)} transition-colors focus:outline-none`}
                      >
                        {request.status.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    {/* User Info Row */}
                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-700">
                      <div><span className="font-medium">Name:</span> {request.fullName || 'N/A'}</div>
                      <div><span className="font-medium">Email:</span> {request.email || 'N/A'}</div>
                      <div><span className="font-medium">Phone:</span> {request.phoneNumber || 'N/A'}</div>
                      <div><span className="font-medium">Service:</span> {request.service}</div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Collapsible Description */}
                      <Accordion type="single" collapsible defaultValue={undefined}>
                        <AccordionItem value={`desc-${(page - 1) * itemsPerPage + idx}`}>
                          <AccordionTrigger className="text-base font-medium">
                            Request Details
                          </AccordionTrigger>
                          <AccordionContent>
                            <p className="text-gray-600 text-sm whitespace-pre-line">
                              {request.details || `Request for ${request.service}`}
                            </p>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

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
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <nav className="flex justify-center items-center gap-2 mt-8" role="navigation" aria-label="Pagination">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  aria-label="Previous page"
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i + 1}
                    variant={page === i + 1 ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPage(i + 1)}
                    aria-current={page === i + 1 ? 'page' : undefined}
                    aria-label={`Go to page ${i + 1}`}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  aria-label="Next page"
                >
                  Next
                </Button>
              </nav>
            )}
          </>
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
