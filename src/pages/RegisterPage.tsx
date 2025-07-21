import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Heart } from 'lucide-react';
import Header from '@/components/Header';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
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

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
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
      const success = await register({
        name: formData.fullName.trim(),
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      
      if (success) {
        toast({
          title: "Account Created Successfully",
          description: "Welcome! You can now access your health and wellness benefits.",
        });
        navigate('/');
      } else {
        toast({
          title: "Registration Failed",
          description: "Unable to create account. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while creating your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Header showNavLogin={false} isAuthenticated={false} />
      {/* Main Content */}
      <main className="mt-8 sm:mx-auto sm:w-full sm:max-w-md" id="main-content">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Create Your Account</CardTitle>
            <CardDescription>
              Fill in your details to get started with your wellness journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Full Name Field */}
              <div>
                <Label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name <span className="text-red-500" aria-label="required">*</span>
                </Label>
                <Input
                  ref={firstFieldRef}
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="Enter your full name (e.g., John Doe)"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={`mt-1 ${errors.fullName ? 'border-red-500' : ''}`}
                  aria-describedby={errors.fullName ? 'fullName-error fullName-help' : 'fullName-help'}
                  aria-invalid={!!errors.fullName}
                />
                <p id="fullName-help" className="mt-1 text-sm text-gray-500">
                  Enter your first and last name as they appear on official documents
                </p>
                {errors.fullName && (
                  <p id="fullName-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address <span className="text-red-500" aria-label="required">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email address (e.g., john@example.com)"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
                  aria-describedby={errors.email ? 'email-error email-help' : 'email-help'}
                  aria-invalid={!!errors.email}
                />
                <p id="email-help" className="mt-1 text-sm text-gray-500">
                  We'll use this email to send you important updates and notifications
                </p>
                {errors.email && (
                  <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <Label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number <span className="text-red-500" aria-label="required">*</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  placeholder="Enter your phone number (e.g., (555) 123-4567)"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`mt-1 ${errors.phone ? 'border-red-500' : ''}`}
                  aria-describedby={errors.phone ? 'phone-error phone-help' : 'phone-help'}
                  aria-invalid={!!errors.phone}
                />
                <p id="phone-help" className="mt-1 text-sm text-gray-500">
                  Include area code for faster service responses
                </p>
                {errors.phone && (
                  <p id="phone-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password <span className="text-red-500" aria-label="required">*</span>
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`mt-1 ${errors.password ? 'border-red-500' : ''}`}
                  aria-describedby={errors.password ? 'password-error password-help' : 'password-help'}
                  aria-invalid={!!errors.password}
                />
                <p id="password-help" className="mt-1 text-sm text-gray-500">
                  Must be at least 8 characters with uppercase, lowercase, and numbers
                </p>
                {errors.password && (
                  <p id="password-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password <span className="text-red-500" aria-label="required">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`mt-1 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  aria-describedby={errors.confirmPassword ? 'confirmPassword-error confirmPassword-help' : 'confirmPassword-help'}
                  aria-invalid={!!errors.confirmPassword}
                />
                <p id="confirmPassword-help" className="mt-1 text-sm text-gray-500">
                  Must match the password entered above
                </p>
                {errors.confirmPassword && (
                  <p id="confirmPassword-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms and Conditions */}
              <fieldset className="space-y-2">
                <legend className="sr-only">Terms and Conditions Agreement</legend>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
                      aria-describedby="terms-help terms-error"
                      aria-invalid={!!errors.agreeToTerms}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <Label htmlFor="terms" className="font-medium text-gray-700">
                      I agree to the{' '}
                      <a href="#" className="text-primary hover:text-primary/80 underline">
                        Terms and Conditions
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-primary hover:text-primary/80 underline">
                        Privacy Policy
                      </a>
                      <span className="text-red-500" aria-label="required"> *</span>
                    </Label>
                    <p id="terms-help" className="mt-1 text-gray-500">
                      By checking this box, you agree to our terms of service and privacy practices
                    </p>
                    {errors.agreeToTerms && (
                      <p id="terms-error" className="mt-1 text-red-600" role="alert">
                        {errors.agreeToTerms}
                      </p>
                    )}
                  </div>
                </div>
              </fieldset>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 min-h-[48px]"
                disabled={isLoading}
                aria-describedby="register-button-description"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
              <p id="register-button-description" className="sr-only">
                Create your account to access health and wellness benefits
              </p>
            </form>

            {/* Login Link */}
            <nav className="text-center" role="navigation" aria-label="Account access">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-primary hover:text-primary/80 focus:outline-none focus:underline"
                  aria-describedby="login-link-description"
                >
                  Sign In
                </Link>
              </p>
              <p id="login-link-description" className="sr-only">
                Navigate to login page if you already have an account
              </p>
            </nav>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <nav className="mt-6 text-center" role="navigation" aria-label="Page navigation">
          <Link
            to="/"
            className="text-sm text-gray-600 hover:text-gray-900 focus:outline-none focus:underline"
            aria-describedby="home-link-description"
          >
            ← Back to Home
          </Link>
          <p id="home-link-description" className="sr-only">
            Return to the homepage
          </p>
        </nav>
      </main>
    </div>
  );
};

export default RegisterPage;
