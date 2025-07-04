import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { useAuth } from '@/contexts/AuthContext';
import { useRequests } from '@/contexts/RequestContext';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, List } from 'lucide-react';
import MediaUpload from '@/components/MediaUpload';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase, type HealthBenefitRequest } from '@/lib/supabase';

const services = [
  'Health Check',
  'Diagnostic Tests', 
  'Doctor Consultation',
  'Wellness Store',
  'Pharmacy',
  'Dental Care',
  'Vision Care',
  'Gym Membership',
  'Emotional Therapy',
  'Diet Consultation'
];

const RequestFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated, logout } = useAuth();
  const { addRequest } = useRequests();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [screenReaderAnnouncement, setScreenReaderAnnouncement] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    service: '',
    description: '',
    documents: null as FileList | null,
    availabilityDate: '',
    availabilityTime: '',
    contactMethod: 'email'
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Auto-focus ref for accessibility
  const firstFieldRef = useRef<HTMLInputElement>(null);

  // Auto-focus first field when component mounts
  useEffect(() => {
    // Small delay to ensure the component is fully rendered
    const timer = setTimeout(() => {
      if (firstFieldRef.current) {
        firstFieldRef.current.focus();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Auto-select service from query params or sessionStorage
  useEffect(() => {
    // Check query parameters first
    const serviceFromQuery = searchParams.get('service');
    
    // Check sessionStorage for service (in case user had to login first)
    const serviceFromStorage = sessionStorage.getItem('selectedService');
    
    const selectedService = serviceFromQuery || serviceFromStorage;
    
    if (selectedService && services.includes(selectedService)) {
      setFormData(prev => ({ ...prev, service: selectedService }));
      
      // Clear sessionStorage after using it
      if (serviceFromStorage) {
        sessionStorage.removeItem('selectedService');
      }
      
      // Announce to screen readers using state-based live region
      setScreenReaderAnnouncement(`${selectedService} service has been automatically selected based on your previous choice`);
      
      // Clear announcement after screen reader has time to read it
      setTimeout(() => {
        setScreenReaderAnnouncement('');
      }, 1000);
    }
  }, [searchParams]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }

    if (!formData.service) {
      newErrors.service = 'Please select a service';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Request description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Prepare data for database insertion
      const requestData: Omit<HealthBenefitRequest, 'id' | 'created_at' | 'updated_at'> = {
        full_name: formData.fullName.trim(),
        email: formData.email.trim(),
        phone_number: formData.phoneNumber.trim(),
        service: formData.service,
        description: formData.description || `Request for ${formData.service}`,
        contact_method: formData.contactMethod,
        availability_date: formData.availabilityDate || null,
        availability_time: formData.availabilityTime || null,
        documents: formData.documents ? Array.from(formData.documents).map(file => ({
          name: file.name,
          size: file.size,
          type: file.type
        })) : null,
        status: 'pending'
      };

      // Insert data into Supabase
      const { data, error } = await supabase
        .from('twc_a11y_hsbc')
        .insert([requestData])
        .select();

      if (error) {
        throw error;
      }

      // Only add to context if user is authenticated
      if (isAuthenticated) {
        addRequest({
          service: formData.service,
          details: formData.description || `Request for ${formData.service}`,
          contactMethod: formData.contactMethod as 'phone' | 'email' | 'video',
          additionalRequirements: '',
          needsAccessibilityAssistance: false
        });
      }

      toast({
        title: "Request Submitted Successfully",
        description: "We've received your request! Our team will contact you shortly to guide you through the next steps.",
      });
      
      navigate('/success');
    } catch (error) {
      console.error('Error submitting request:', error);
      toast({
        title: "Error",
        description: "An error occurred while submitting your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | FileList | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/81eef39a-e573-4fd1-9023-d796f35d9e41.png" 
                alt="The Wellness Corner - Corporate Health and Wellness Benefits Platform"
                className="h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded" 
                onClick={() => navigate('/')} 
                role="button" 
                tabIndex={0} 
                aria-label="Go to homepage"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate('/');
                  }
                }}
              />
            </div>
            <nav className="flex items-center space-x-6" role="navigation" aria-label="Main navigation">
              <Link
                to="/history"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                aria-describedby="history-nav-description"
              >
                Request History
              </Link>
              <p id="history-nav-description" className="sr-only">
                View your previous health benefit requests
              </p>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="text-gray-600 hover:text-gray-900 border-gray-300 hover:border-gray-400 min-h-[40px]"
                aria-describedby="logout-description"
              >
                Logout
              </Button>
              <p id="logout-description" className="sr-only">
                Sign out of your account
              </p>
            </nav>
          </div>
        </div>
      </header>

      {/* Screen reader announcements */}
      <div 
        role="status" 
        aria-live="polite" 
        aria-label="Form status updates"
        className="sr-only"
      >
        {screenReaderAnnouncement}
      </div>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="main-content">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <header className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Request Health Benefits
              </h1>
              <p className="text-gray-600">
                Submit your request for health and wellness services below
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8" noValidate>
              {/* Personal Information Section */}
              <fieldset className="space-y-6">
                <legend className="text-lg font-semibold text-gray-900 mb-4">
                  Personal Information
                </legend>
                
                {/* Full Name */}
                <div>
                  <Label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500" aria-label="required">*</span>
                  </Label>
                  <Input
                    ref={firstFieldRef}
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    placeholder="Enter your full name (e.g., John Doe)"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={`${errors.fullName ? 'border-red-500' : ''}`}
                    aria-describedby={errors.fullName ? 'fullName-error fullName-help' : 'fullName-help'}
                    aria-invalid={!!errors.fullName}
                  />
                  <p id="fullName-help" className="mt-1 text-sm text-gray-500">
                    Enter your first and last name exactly as they appear on your ID
                  </p>
                  {errors.fullName && (
                    <p id="fullName-error" className="mt-1 text-sm text-red-600" role="alert">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500" aria-label="required">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="Enter your email address (e.g., john@example.com)"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`${errors.email ? 'border-red-500' : ''}`}
                    aria-describedby={errors.email ? 'email-error email-help' : 'email-help'}
                    aria-invalid={!!errors.email}
                  />
                  <p id="email-help" className="mt-1 text-sm text-gray-500">
                    We'll send updates about your request to this email address
                  </p>
                  {errors.email && (
                    <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <Label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500" aria-label="required">*</span>
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="Enter your phone number (e.g., (555) 123-4567)"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className={`${errors.phoneNumber ? 'border-red-500' : ''}`}
                    aria-describedby={errors.phoneNumber ? 'phone-error phone-help' : 'phone-help'}
                    aria-invalid={!!errors.phoneNumber}
                  />
                  <p id="phone-help" className="mt-1 text-sm text-gray-500">
                    Include area code for faster response times
                  </p>
                  {errors.phoneNumber && (
                    <p id="phone-error" className="mt-1 text-sm text-red-600" role="alert">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>
              </fieldset>

              {/* Service Request Section */}
              <fieldset className="space-y-6">
                <legend className="text-lg font-semibold text-gray-900 mb-4">
                  Service Request Details
                </legend>

                {/* Service Type */}
                <div>
                  <Label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-1">
                    Service Type <span className="text-red-500" aria-label="required">*</span>
                  </Label>
                  <Select
                    value={formData.service}
                    onValueChange={(value) => handleInputChange('service', value)}
                    aria-describedby={errors.service ? 'service-error service-help' : 'service-help'}
                    aria-invalid={!!errors.service}
                  >
                    <SelectTrigger id="serviceType" className={`${errors.service ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Select the type of service you need..." />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p id="service-help" className="mt-1 text-sm text-gray-500">
                    Choose the service that best matches your health and wellness needs
                  </p>
                  {errors.service && (
                    <p id="service-error" className="mt-1 text-sm text-red-600" role="alert">
                      {errors.service}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Request Description <span className="text-red-500" aria-label="required">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={4}
                    required
                    placeholder="Describe your request in detail... Include any specific needs, preferences, or concerns that would help us provide better assistance."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className={`${errors.description ? 'border-red-500' : ''}`}
                    aria-describedby={errors.description ? 'description-error description-help' : 'description-help'}
                    aria-invalid={!!errors.description}
                  />
                  <p id="description-help" className="mt-1 text-sm text-gray-500">
                    The more details you provide, the better we can tailor our response to your needs
                  </p>
                  {errors.description && (
                    <p id="description-error" className="mt-1 text-sm text-red-600" role="alert">
                      {errors.description}
                    </p>
                  )}
                </div>
              </fieldset>

              {/* Contact Preferences Section */}
              <fieldset className="space-y-6">
                <legend className="text-lg font-semibold text-gray-900 mb-4">
                  Contact Preferences
                </legend>

                {/* Contact Method */}
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-3">
                    Preferred Contact Method <span className="text-red-500" aria-label="required">*</span>
                  </Label>
                  <RadioGroup
                    value={formData.contactMethod}
                    onValueChange={(value) => handleInputChange('contactMethod', value)}
                    className="space-y-2"
                    aria-describedby="contactMethod-help"
                    required
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="phone" id="contact-phone" />
                      <Label htmlFor="contact-phone" className="text-sm font-normal">
                        Phone Call
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="contact-email" />
                      <Label htmlFor="contact-email" className="text-sm font-normal">
                        Email
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="both" id="contact-both" />
                      <Label htmlFor="contact-both" className="text-sm font-normal">
                        Both Phone and Email
                      </Label>
                    </div>
                  </RadioGroup>
                  <p id="contactMethod-help" className="mt-1 text-sm text-gray-500">
                    How would you like us to contact you regarding your request?
                  </p>
                  {errors.contactMethod && (
                    <p className="mt-1 text-sm text-red-600" role="alert">
                      {errors.contactMethod}
                    </p>
                  )}
                </div>
              </fieldset>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="min-h-[48px]"
                  aria-describedby="cancel-description"
                >
                  Cancel
                </Button>
                <p id="cancel-description" className="sr-only">
                  Cancel request and return to homepage
                </p>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-primary hover:bg-primary/90 min-h-[48px]"
                  aria-describedby="submit-description"
                >
                  {isLoading ? 'Submitting...' : 'Submit Request'}
                </Button>
                <p id="submit-description" className="sr-only">
                  Submit your health benefit request for processing
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RequestFormPage;
