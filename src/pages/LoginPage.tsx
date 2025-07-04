import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Heart } from 'lucide-react';
import { 
  EnhancedField, 
  PasswordField, 
  ValidationSummary, 
  FormAnnouncement,
  FieldGroup 
} from '@/components/FormEnhancements';
import { useKeyboardShortcuts, ShortcutAnnouncement } from '@/hooks/useKeyboardShortcuts';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
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
      const success = await login(formData.email, formData.password);
      
      if (success) {
        toast({
          title: "Login Successful",
          description: "You've logged in successfully! You can now access your benefits and track your requests.",
        });
        
        // Check if there's a selected service in sessionStorage
        const selectedService = sessionStorage.getItem('selectedService');
        if (selectedService) {
          // Navigate to request form with the selected service
          navigate(`/request?service=${encodeURIComponent(selectedService)}`);
        } else {
          navigate('/');
        }
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid credentials. Please check your email and password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while logging in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img 
            src="/lovable-uploads/81eef39a-e573-4fd1-9023-d796f35d9e41.png" 
            alt=""
            aria-hidden="true"
            className="h-12"
          />
        </div>
        <h1 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Please Log In to Continue
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Access your health and wellness benefits
        </p>
      </header>

      {/* Main Content */}
      <main className="mt-8 sm:mx-auto sm:w-full sm:max-w-md" id="main-content">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Email Field */}
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address <span className="text-red-500" aria-label="required">*</span>
                </Label>
                <Input
                  ref={firstFieldRef}
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
                  Use the email address associated with your account
                </p>
                {errors.email && (
                  <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.email}
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
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`mt-1 ${errors.password ? 'border-red-500' : ''}`}
                  aria-describedby={errors.password ? 'password-error password-help' : 'password-help'}
                  aria-invalid={!!errors.password}
                />
                <p id="password-help" className="mt-1 text-sm text-gray-500">
                  Password must be at least 8 characters long
                </p>
                {errors.password && (
                  <p id="password-error" className="mt-1 text-sm text-red-600" role="alert">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-primary hover:text-primary/80 focus:outline-none focus:underline"
                  onClick={() => {
                    toast({
                      title: "Password Reset",
                      description: "Password reset functionality will be available soon. Please contact support for assistance.",
                    });
                  }}
                  aria-describedby="forgot-password-description"
                >
                  Forgot Password?
                </button>
                <p id="forgot-password-description" className="sr-only">
                  Opens password reset assistance
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 min-h-[48px]"
                disabled={isLoading}
                aria-describedby="login-button-description"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
              <p id="login-button-description" className="sr-only">
                Sign in to access your health and wellness benefits
              </p>
            </form>

            {/* OTP Option */}
            <section className="mt-6" role="region" aria-labelledby="alt-login-heading">
              <h2 id="alt-login-heading" className="sr-only">Alternative Login Methods</h2>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary/5 min-h-[48px]"
                  onClick={() => {
                    toast({
                      title: "OTP Login",
                      description: "OTP login functionality will be available soon.",
                    });
                  }}
                  aria-describedby="otp-login-description"
                >
                  Log in with OTP
                </Button>
                <p id="otp-login-description" className="sr-only">
                  Alternative login method using one-time password
                </p>
              </div>
            </section>

            {/* Register Link */}
            <nav className="text-center" role="navigation" aria-label="Account creation">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-medium text-primary hover:text-primary/80 focus:outline-none focus:underline"
                  aria-describedby="register-link-description"
                >
                  Create Account
                </Link>
              </p>
              <p id="register-link-description" className="sr-only">
                Navigate to account registration page
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

export default LoginPage;
