
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface HealthRequest {
  id: string;
  service: string;
  details: string;
  contactMethod: 'phone' | 'email' | 'video';
  additionalRequirements: string;
  needsAccessibilityAssistance: boolean;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  isGuestSubmission?: boolean;
  guestInfo?: {
    fullName: string;
    email: string;
    phoneNumber: string;
  };
}

interface RequestContextType {
  requests: HealthRequest[];
  addRequest: (request: Omit<HealthRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => void;
  updateRequestStatus: (id: string, status: HealthRequest['status']) => void;
  getActiveRequest: () => HealthRequest | null;
  getUserRequests: () => HealthRequest[];
}

const RequestContext = createContext<RequestContextType | undefined>(undefined);

export const useRequests = () => {
  const context = useContext(RequestContext);
  if (context === undefined) {
    throw new Error('useRequests must be used within a RequestProvider');
  }
  return context;
};

export const RequestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState<HealthRequest[]>([]);

  const addRequest = (requestData: Omit<HealthRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    const newRequest: HealthRequest = {
      ...requestData,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setRequests(prev => [newRequest, ...prev]);
    
    // Log for demo purposes
    console.log('New request submitted:', newRequest);
  };

  const updateRequestStatus = (id: string, status: HealthRequest['status']) => {
    setRequests(prev => prev.map(request => 
      request.id === id 
        ? { ...request, status, updatedAt: new Date() }
        : request
    ));
  };

  const getActiveRequest = () => {
    return requests.find(request => 
      request.status === 'pending' || request.status === 'in-progress'
    ) || null;
  };

  const getUserRequests = () => {
    // Filter out guest submissions for authenticated user view
    return requests.filter(request => !request.isGuestSubmission);
  };

  const value = {
    requests: getUserRequests(),
    addRequest,
    updateRequestStatus,
    getActiveRequest,
    getUserRequests
  };

  return <RequestContext.Provider value={value}>{children}</RequestContext.Provider>;
};
