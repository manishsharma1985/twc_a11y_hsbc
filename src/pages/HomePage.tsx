import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/contexts/AuthContext';
import { useRequests } from '@/contexts/RequestContext';
import { Calendar, Phone, User, Clock, ChevronRight, List, Mail, FileText, Heart } from 'lucide-react';
import hsbc_logo from '../../public/hsbc_logo.svg'
import Header from '@/components/Header';
const services = [{
  id: 'health-check',
  title: 'Health Checks',
  description: 'Comprehensive health assessments and screenings',
  image: '/lovable-uploads/7740a56c-7772-43db-b5cb-e311032309e2.png',
  formValue: 'Health Check'
}, {
  id: 'diagnostic-tests',
  title: 'Diagnostic Tests',
  description: 'Laboratory tests and medical imaging services',
  image: '/lovable-uploads/cfe01cb4-f4d2-4c5e-b6d5-31790bfff6cf.png',
  formValue: 'Diagnostic Tests'
}, {
  id: 'medicines-pharmacy',
  title: 'Medicines & Pharmacy',
  description: 'Prescription medications and pharmacy services',
  image: '/lovable-uploads/29ba1993-0c25-45eb-920f-0f00e82435f7.png',
  formValue: 'Pharmacy'
}, {
  id: 'wellness-store',
  title: 'Wellness Store',
  description: 'Health supplements and wellness products',
  image: '/lovable-uploads/112f398d-97df-4aa6-841a-25941a888969.png',
  formValue: 'Wellness Store'
}, {
  id: 'gym-memberships',
  title: 'Gym Memberships',
  description: 'Access to fitness facilities and wellness programs',
  image: '/lovable-uploads/20867726-eaca-4856-83cf-eb278b6a6687.png',
  formValue: 'Gym Membership'
}, {
  id: 'consult-doctor',
  title: 'Consult a Doctor',
  description: 'Virtual and in-person consultations with specialists',
  image: '/lovable-uploads/d6c5ed61-e222-4fc1-bc59-fbd5d052d67e.png',
  formValue: 'Doctor Consultation'
}, {
  id: 'emotional-therapy',
  title: 'Emotional Therapy',
  description: 'Mental health support and counseling services',
  image: '/lovable-uploads/978e2425-9668-4ddc-b7b3-c832cfdc3538.png',
  formValue: 'Emotional Therapy'
}, {
  id: 'diet-consultations',
  title: 'Diet Consultations',
  description: 'Nutritional guidance and diet planning services',
  image: '/lovable-uploads/b0466dcf-c278-437f-8c3a-678dde31b28d.png',
  formValue: 'Diet Consultation'
}];
const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200 focus:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2';
    case 'in-progress':
      return 'bg-yellow-50 text-yellow-800 border-yellow-200 hover:bg-yellow-100 focus:bg-yellow-100 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2';
    case 'completed':
      return 'bg-green-50 text-green-800 border-green-200 hover:bg-green-100 focus:bg-green-100 focus:ring-2 focus:ring-green-500 focus:ring-offset-2';
    case 'cancelled':
      return 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100 focus:bg-red-100 focus:ring-2 focus:ring-red-500 focus:ring-offset-2';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200 focus:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2';
  }
};
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [screenReaderAnnouncement, setScreenReaderAnnouncement] = useState('');
  const {
    user,
    isAuthenticated,
    logout
  } = useAuth();
  const {
    getActiveRequest
  } = useRequests();
  const activeRequest = getActiveRequest();
  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  const handleSubmitNewRequest = (serviceId?: string) => {
    const selectedService = serviceId ? services.find(s => s.id === serviceId) : null;
    const queryParam = selectedService ? `?service=${encodeURIComponent(selectedService.formValue)}` : '';
    
    if (isAuthenticated) {
      setScreenReaderAnnouncement(`Navigating to request form page${selectedService ? ` with ${selectedService.title} pre-selected` : ''}`);
      navigate(`/request${queryParam}`);
    } else {
      setScreenReaderAnnouncement('Please log in to submit a request. Navigating to login page');
      // Store the selected service in sessionStorage to persist through login
      if (selectedService) {
        sessionStorage.setItem('selectedService', selectedService.formValue);
      }
      navigate('/login');
    }
    // Clear announcement after screen reader has time to read it
    setTimeout(() => setScreenReaderAnnouncement(''), 1000);
  };
  return <div className="min-h-screen bg-gray-50">
      <Header
        user={user}
        isAuthenticated={isAuthenticated}
        logout={logout}
        screenReaderAnnouncement={screenReaderAnnouncement}
      />
      {/* Main Content */}
      <main id="main-content" className="max-w-[1140px] mx-auto px-2 sm:px-6 py-6 sm:py-12" role="main">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Welcome to The Wellness Corner
          </h1>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Access your corporate health and wellness benefits with ease. Our platform provides specially-abled individuals 
            with seamless access to health checks, consultations, wellness services, and more.
          </p>
        </div>

        {/* Active Request Section - Only show if user has an active request */}
        {isAuthenticated && activeRequest && <section className="mb-16">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Your Active Request
              </h2>
              <Button variant="link" className="text-primary font-medium" onClick={() => navigate('/history')} aria-label="View all requests">
                View All Requests
              </Button>
            </div>
            <Card className="border border-blue-200 bg-blue-50/50">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{activeRequest.service}</h3>
                    <p className="text-gray-600 text-sm mb-3">{activeRequest.details}</p>
                  </div>
                  <Badge 
                    className={`${getStatusColor(activeRequest.status)} border font-medium transition-colors`}
                  >
                    {activeRequest.status === 'in-progress' ? 'In Process' : activeRequest.status.charAt(0).toUpperCase() + activeRequest.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Submitted on {activeRequest.createdAt.toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </section>}

        {/* Services Grid */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-12">Our Health & Wellness Services</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6">
            {services.map(service => (
              <div 
                key={service.id} 
                className="text-center group cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label={`Select ${service.title} service - ${service.description}`}
                onClick={() => handleSubmitNewRequest(service.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSubmitNewRequest(service.id);
                  }
                }}
              >
                <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 mb-3 sm:mb-4 border border-gray-100 group-hover:border-primary/20 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 min-h-[80px] flex items-center justify-center">
                  <img 
                    src={service.image} 
                    alt={`${service.title} service icon - ${service.description}`} 
                    className="h-12 w-12 mx-auto object-contain"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-xs sm:text-sm font-medium text-gray-900 leading-tight group-hover:text-primary transition-colors text-center">
                  {service.title}
                </h3>
                <p className="text-xs text-gray-600 mt-1 leading-tight text-center px-1">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How it Works */}
        <section className="mb-20">
          <h2 className="text-3xl font-semibold text-gray-900 text-center mb-16">How It Works</h2>
          <ol className="grid md:grid-cols-3 gap-8 list-none">
            <li className="text-center relative">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 relative">
                <User className="h-8 w-8 text-primary" />
                <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  1
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 1</h3>
              <p className="font-medium text-gray-700 mb-2">Log in to your account</p>
              {/* Arrow for desktop */}
              <div className="hidden md:block absolute top-8 -right-4">
                <ChevronRight className="h-6 w-6 text-primary" />
              </div>
            </li>
            <li className="text-center relative">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 relative">
                <Calendar className="h-8 w-8 text-primary" />
                <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  2
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 2</h3>
              <p className="font-medium text-gray-700 mb-2">Submit your request</p>
              {/* Arrow for desktop */}
              <div className="hidden md:block absolute top-8 -right-4">
                <ChevronRight className="h-6 w-6 text-primary" />
              </div>
            </li>
            <li className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 relative">
                <Phone className="h-8 w-8 text-primary" />
                <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  3
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Step 3</h3>
              <p className="font-medium text-gray-700 mb-2">Get assistance</p>
            </li>
          </ol>
        </section>

        {/* New Health Benefits Access Section */}
        <section className="mb-20">
          <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-3xl p-4 sm:p-12 text-center border border-primary/20 shadow-xl">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-6">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-6">Access Your Health Benefits with Ease – We're Here to Assist You.</h2>
              <p className="text-lg text-gray-600 mb-12 leading-relaxed">
                We've made it easy for you to get the help you need. Choose one of the following options to connect with us:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
                <Card className="border-primary/20 hover:border-primary/40 transition-colors bg-white/80">
                  <CardContent className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-6">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Us via Email</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Drop us a message, and we'll get back to you as soon as possible.
                    </p>
                    <Button 
                      onClick={() => window.location.href = 'mailto:support@thewellnesscorner.com'} 
                      className="bg-primary hover:bg-primary/90 text-white w-full min-h-[48px] px-4 py-3 text-base font-medium rounded-lg focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      aria-label="Send email to support team at support@thewellnesscorner.com"
                    >
                      <Mail className="h-4 w-4 mr-2" aria-hidden="true" />
                      Send Email
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="border-primary/20 hover:border-primary/40 transition-colors bg-white/80">
                  <CardContent className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-6">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Fill Out the Form</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Complete the form, and our team will reach out to you with all the details.
                    </p>
                    <Button 
                      onClick={() => handleSubmitNewRequest()} 
                      className="bg-primary hover:bg-primary/90 text-white w-full min-h-[48px] px-4 py-3 text-base font-medium rounded-lg focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      aria-label="Submit a new health benefits request"
                    >
                      <FileText className="h-4 w-4 mr-2" aria-hidden="true" />
                      Submit Request
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="border-primary/20 hover:border-primary/40 transition-colors bg-white/80">
                  <CardContent className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-6">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Call Us</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Prefer to talk to someone? Give us a call, and we'll assist you right away.
                    </p>
                    <Button 
                      onClick={() => window.location.href = 'tel:+1-800-WELLNESS'} 
                      className="bg-primary hover:bg-primary/90 text-white w-full min-h-[48px] px-4 py-3 text-base font-medium rounded-lg focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      aria-label="Call support team at 1-800-WELLNESS"
                    >
                      <Phone className="h-4 w-4 mr-2" aria-hidden="true" />
                      Call Now
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              <div className="text-center mt-8">
                <p className="text-gray-600 font-medium">
                  Your health journey is important to us, and we're here to make it easier for you.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Helpline Details */}
        <section className="mb-20">
          <div className="bg-white rounded-3xl p-12 shadow-lg border border-gray-200">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-6">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Helpline Details</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Our customer support team is ready to assist you with any questions or concerns about your health and wellness benefits.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-primary/20 hover:border-primary/40 transition-colors">
                  <CardContent className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
                    <p className="text-gray-600 mb-4">Send us an email and we'll get back to you within 24 hours</p>
                    <a href="mailto:support@thewellnesscorner.com" className="text-primary font-medium hover:text-primary/80 transition-colors break-all">
                      support@thewellnesscorner.com
                    </a>
                  </CardContent>
                </Card>
                
                <Card className="border-primary/20 hover:border-primary/40 transition-colors">
                  <CardContent className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone Support</h3>
                    <p className="text-gray-600 mb-4">Call us for immediate assistance during business hours</p>
                    <a href="tel:+1-800-WELLNESS" className="text-primary font-medium hover:text-primary/80 transition-colors text-xl">
                      +1 (800) WELLNESS
                    </a>
                  </CardContent>
                </Card>
              </div>
              
              <div className="text-center mt-8">
                <p className="text-sm text-gray-500">
                  Business Hours: Monday - Friday, 9:00 AM - 6:00 PM EST
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white" role="contentinfo">
        <div className="max-w-[1140px] mx-auto px-6 py-12">
          <div className="text-center">
            <p className="text-gray-300 mb-4">© 2024 Truworth Health Technologies Pvt. Ltd.</p>
            <nav className="flex justify-center space-x-8" role="navigation" aria-label="Footer navigation">
              <button 
                className="text-sm text-gray-400 hover:text-white cursor-pointer transition-colors focus:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-2 py-1"
                aria-label="View terms of use"
              >
                Terms of Use
              </button>
              <button 
                className="text-sm text-gray-400 hover:text-white cursor-pointer transition-colors focus:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-2 py-1"
                aria-label="View privacy policy"
              >
                Privacy Policy
              </button>
            </nav>
          </div>
        </div>
      </footer>
    </div>;
};
export default HomePage;