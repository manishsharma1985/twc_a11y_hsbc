/**
 * Enhanced Form Accessibility Components
 * 
 * Reusable components for better form accessibility and UX
 */

import React, { useState, useEffect } from 'react';
import { AlertCircle, Check, Eye, EyeOff, Info } from 'lucide-react';

// Live validation announcements
export const FormAnnouncement: React.FC<{
  message: string;
  type: 'error' | 'success' | 'info';
}> = ({ message, type }) => {
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (message) {
      setAnnouncement(message);
      // Clear after screen reader has time to announce
      const timer = setTimeout(() => setAnnouncement(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!announcement) return null;

  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      className="sr-only"
      aria-label={`Form ${type}: ${announcement}`}
    >
      {announcement}
    </div>
  );
};

// Enhanced field wrapper with better error handling
export const EnhancedField: React.FC<{
  children: React.ReactNode;
  label: string;
  id: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  description?: string;
}> = ({ children, label, id, required, error, helpText, description }) => {
  const helpId = `${id}-help`;
  const errorId = `${id}-error`;
  const descriptionId = `${id}-description`;
  
  return (
    <div className="space-y-2">
      <label 
        htmlFor={id} 
        className={`block text-sm font-medium ${error ? 'text-red-700' : 'text-gray-700'}`}
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
      
      {description && (
        <p id={descriptionId} className="text-sm text-gray-600">
          {description}
        </p>
      )}
      
      <div className="relative">
        {React.cloneElement(children as React.ReactElement, {
          id,
          'aria-describedby': [
            error ? errorId : null,
            helpText ? helpId : null,
            description ? descriptionId : null
          ].filter(Boolean).join(' ') || undefined,
          'aria-invalid': !!error,
          'aria-required': required,
          className: `${(children as React.ReactElement).props.className || ''} ${
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
          }`.trim()
        })}
        
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
          </div>
        )}
      </div>
      
      {helpText && !error && (
        <p id={helpId} className="text-sm text-gray-500 flex items-start">
          <Info className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" aria-hidden="true" />
          {helpText}
        </p>
      )}
      
      {error && (
        <p id={errorId} className="text-sm text-red-600 flex items-start" role="alert">
          <AlertCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
};

// Enhanced password field with visibility toggle
export const PasswordField: React.FC<{
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  id: string;
  label?: string;
  placeholder?: string;
  autoComplete?: string;
}> = ({ 
  value, 
  onChange, 
  error, 
  required, 
  id, 
  label = "Password",
  placeholder = "Enter your password",
  autoComplete = "current-password"
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState<{
    score: number;
    feedback: string;
    color: string;
  }>({ score: 0, feedback: '', color: 'gray' });

  useEffect(() => {
    if (value) {
      const score = calculatePasswordStrength(value);
      setStrength(score);
    } else {
      setStrength({ score: 0, feedback: '', color: 'gray' });
    }
  }, [value]);

  const calculatePasswordStrength = (password: string) => {
    let score = 0;
    let feedback = '';
    let color = 'gray';

    if (password.length >= 8) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^a-zA-Z\d]/.test(password)) score += 1;

    if (score <= 2) {
      feedback = 'Weak password';
      color = 'red';
    } else if (score <= 3) {
      feedback = 'Fair password';
      color = 'yellow';
    } else if (score <= 4) {
      feedback = 'Good password';
      color = 'blue';
    } else {
      feedback = 'Strong password';
      color = 'green';
    }

    return { score, feedback, color };
  };

  return (
    <EnhancedField
      label={label}
      id={id}
      required={required}
      error={error}
              helpText="Password must be at least 8 characters long"
      description="Use a mix of letters, numbers, and symbols for better security"
    >
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm pr-20"
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center">
          {value && (
            <div className={`mr-2 w-2 h-2 rounded-full bg-${strength.color}-500`} />
          )}
          
          <button
            type="button"
            className="mr-2 p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-describedby={`${id}-visibility-help`}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Eye className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
        
        <p id={`${id}-visibility-help`} className="sr-only">
          Toggle password visibility. Currently {showPassword ? 'visible' : 'hidden'}.
        </p>
      </div>
      
      {value && (
        <div className="mt-2">
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full bg-${strength.color}-500 transition-all duration-300`}
                style={{ width: `${(strength.score / 5) * 100}%` }}
                role="progressbar"
                aria-valuenow={strength.score}
                aria-valuemin={0}
                aria-valuemax={5}
                aria-label="Password strength"
              />
            </div>
            <span className={`text-sm font-medium text-${strength.color}-600`}>
              {strength.feedback}
            </span>
          </div>
        </div>
      )}
    </EnhancedField>
  );
};

// Form validation summary for screen readers
export const ValidationSummary: React.FC<{
  errors: Record<string, string>;
  title?: string;
}> = ({ errors, title = "Please fix the following errors:" }) => {
  const errorList = Object.entries(errors).filter(([, error]) => error);
  
  if (errorList.length === 0) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="rounded-md bg-red-50 border border-red-200 p-4 mb-6"
      tabIndex={-1}
      aria-labelledby="validation-summary-title"
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 id="validation-summary-title" className="text-sm font-medium text-red-800">
            {title}
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <ul className="list-disc pl-5 space-y-1">
              {errorList.map(([field, error]) => (
                <li key={field}>
                  <a 
                    href={`#${field}`}
                    className="underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById(field);
                      if (element) {
                        element.focus();
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }}
                  >
                    {error}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Success confirmation component
export const FormSuccess: React.FC<{
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}> = ({ title, message, actionLabel, onAction }) => {
  useEffect(() => {
    // Announce success to screen readers
    const announcement = `${title}. ${message}`;
    const element = document.createElement('div');
    element.setAttribute('role', 'status');
    element.setAttribute('aria-live', 'polite');
    element.className = 'sr-only';
    element.textContent = announcement;
    document.body.appendChild(element);
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(element);
    }, 3000);
  }, [title, message]);

  return (
    <div 
      className="rounded-md bg-green-50 border border-green-200 p-4"
      role="status"
      aria-labelledby="success-title"
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <Check className="h-5 w-5 text-green-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 id="success-title" className="text-sm font-medium text-green-800">
            {title}
          </h3>
          <div className="mt-2 text-sm text-green-700">
            <p>{message}</p>
          </div>
          {actionLabel && onAction && (
            <div className="mt-4">
              <button
                type="button"
                className="bg-green-100 text-green-800 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-green-50 rounded-md px-3 py-2 text-sm font-medium"
                onClick={onAction}
              >
                {actionLabel}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Field grouping component (fieldset replacement)
export const FieldGroup: React.FC<{
  legend: string;
  description?: string;
  required?: boolean;
  children: React.ReactNode;
}> = ({ legend, description, required, children }) => {
  return (
    <fieldset className="border border-gray-200 rounded-lg p-4 space-y-4">
      <legend className="text-sm font-medium text-gray-900 px-2">
        {legend}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required section">
            *
          </span>
        )}
      </legend>
      {description && (
        <p className="text-sm text-gray-600 -mt-2">
          {description}
        </p>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </fieldset>
  );
}; 