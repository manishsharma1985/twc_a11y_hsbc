import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = sessionStorage.getItem('authUser');
    if (stored) {
      try {
        const { user, expiry } = JSON.parse(stored);
        if (user && expiry && Date.now() < expiry) {
          return user;
        }
      } catch {}
    }
    return null;
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Only allow login with hardcoded credentials
    if (email === 'hsbctest@truworth.com' && password === 'test@123') {
      const userObj = {
        id: '1',
        name: 'HSBC User',
        email: email,
        phone: '+1234567890'
      };
      setUser(userObj);
      sessionStorage.setItem('authUser', JSON.stringify({
        user: userObj,
        expiry: Date.now() + 3 * 60 * 60 * 1000 // 3 hours
      }));
      return true;
    }
    // Invalid credentials
    return false;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful registration
    const userObj = {
      id: '1',
      name: data.name,
      email: data.email,
      phone: data.phone
    };
    setUser(userObj);
    sessionStorage.setItem('authUser', JSON.stringify({
      user: userObj,
      expiry: Date.now() + 3 * 60 * 60 * 1000 // 3 hours
    }));
    return true;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('authUser');
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
