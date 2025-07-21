import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import hsbc_logo from '../../public/hsbc_logo.svg';

interface HeaderProps {
  user?: { name: string; email: string } | null;
  isAuthenticated: boolean;
  logout?: () => void;
  children?: React.ReactNode;
  showHSBCLogo?: boolean;
  showNavHistory?: boolean;
  showNavLogin?: boolean;
  showNavLogout?: boolean;
  showNavHome?: boolean;
  onNavHistory?: () => void;
  onNavLogin?: () => void;
  onNavLogout?: () => void;
  onNavHome?: () => void;
  screenReaderAnnouncement?: string;
}

const getUserInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

const Header: React.FC<HeaderProps> = ({
  user,
  isAuthenticated,
  logout,
  children,
  showHSBCLogo = true,
  showNavHistory = true,
  showNavLogin = true,
  showNavLogout = true,
  showNavHome = false,
  onNavHistory,
  onNavLogin,
  onNavLogout,
  onNavHome,
  screenReaderAnnouncement = '',
}) => {
  const navigate = useNavigate();
  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded-md z-50 focus:z-50">
        Skip to main content
      </a>
      {/* Screen reader announcements */}
      <div 
        role="status" 
        aria-live="polite" 
        aria-label="Status updates"
        className="sr-only"
      >
        {screenReaderAnnouncement}
      </div>
      <header className="bg-white border-b h-fit border-gray-200 p-2" role="banner">
        <div className="max-w-[1140px] mx-auto px-2 sm:px-6">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex flex-col items-center sm:flex-row sm:items-center">
              <Link to="/" aria-label="Go to homepage">
                <img 
                  src="/lovable-uploads/81eef39a-e573-4fd1-9023-d796f35d9e41.png" 
                  alt="The Wellness Corner - Corporate Health and Wellness Benefits Platform" 
                  className="h-6 cursor-pointer hover:opacity-80 transition-opacity focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded" 
                />
              </Link>
                {isAuthenticated && showHSBCLogo && (
                    <img
                      onClick={onNavHome || (() => navigate('/'))}
                      src={hsbc_logo}
                      alt="HSBC corporate logo"
                      className="h-8 sm:h-10 ml-1 sm:ml-4 cursor-pointer hover:opacity-80 transition-opacity focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                    />
                  )}
            </div>
            <nav className="flex items-center space-x-2 sm:space-x-6" role="navigation" aria-label="Main navigation">
              {isAuthenticated ? (
                <div className="flex items-center space-x-2 sm:space-x-6">
                  {showNavHistory && (
                    <Button 
                      variant="ghost" 
                      onClick={onNavHistory || (() => navigate('/history'))}
                      className="flex items-center text-gray-600 hover:text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 text-xs sm:text-sm"
                      aria-label="View all your submitted requests"
                    >
                      View all requests
                    </Button>
                  )}
                  <Popover>
                    <PopoverTrigger asChild>
                      <button 
                        className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full" 
                        aria-label={`User menu for ${user?.name || 'user'} - Click to open account options`}
                        aria-expanded="false"
                        aria-haspopup="true"
                      >
                        <Avatar className="h-10 w-10 cursor-pointer bg-primary/10 border-2 border-primary/20 hover:bg-primary/20 transition-colors">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                            {user ? getUserInitials(user.name) : 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent 
                      className="w-64 p-3" 
                      align="end"
                      role="menu"
                      aria-label="User account menu"
                      onOpenAutoFocus={(event) => {
                        event.preventDefault();
                        const target = event.currentTarget as HTMLElement;
                        const signOutButton = target.querySelector('button');
                        if (signOutButton) {
                          signOutButton.focus();
                        }
                      }}
                    >
                      <div className="space-y-3">
                        <div role="group" aria-label="User information">
                          <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                          <p className="text-xs text-gray-500 break-all">{user?.email}</p>
                        </div>
                        {showNavLogout && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={onNavLogout || logout}
                            className="w-full text-sm focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            role="menuitem"
                            aria-label="Sign out of your account"
                          >
                            Sign Out
                          </Button>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                  {children}
                </div>
              ) : (
                showNavLogin && (
                  <Button 
                    onClick={onNavLogin || (() => navigate('/login'))}
                    className="bg-primary hover:bg-primary/90 text-white focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[48px] px-4 py-3 text-base font-medium rounded-lg"
                    aria-label="Log in to access your wellness benefits"
                  >
                    Login
                  </Button>
                )
              )}
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header; 