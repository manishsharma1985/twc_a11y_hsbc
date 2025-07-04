import React from 'react';

interface ScreenReaderAnnouncementProps {
  message: string;
  priority?: 'polite' | 'assertive';
  className?: string;
}

/**
 * Screen Reader Announcement Component
 * 
 * Provides a live region for screen reader announcements.
 * Use 'polite' for general status updates (default).
 * Use 'assertive' for urgent messages that should interrupt the user.
 * 
 * @param message - The message to announce to screen readers
 * @param priority - The priority level for the announcement
 * @param className - Additional CSS classes
 */
export const ScreenReaderAnnouncement: React.FC<ScreenReaderAnnouncementProps> = ({
  message,
  priority = 'polite',
  className = ''
}) => {
  if (!message) return null;

  return (
    <div 
      role={priority === 'assertive' ? 'alert' : 'status'}
      aria-live={priority}
      aria-label="Status updates"
      className={`sr-only ${className}`}
    >
      {message}
    </div>
  );
};

/**
 * Hook for managing screen reader announcements
 * 
 * @example
 * const { announce } = useScreenReaderAnnouncement();
 * 
 * const handleClick = () => {
 *   announce('Form submitted successfully');
 * };
 */
export const useScreenReaderAnnouncement = () => {
  const [announcement, setAnnouncement] = React.useState('');

  const announce = React.useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    setAnnouncement(message);
    
    // Clear the announcement after screen readers have time to read it
    const timeout = priority === 'assertive' ? 2000 : 1000;
    setTimeout(() => setAnnouncement(''), timeout);
  }, []);

  const clearAnnouncement = React.useCallback(() => {
    setAnnouncement('');
  }, []);

  return {
    announcement,
    announce,
    clearAnnouncement,
    AnnouncementComponent: () => (
      <ScreenReaderAnnouncement message={announcement} />
    )
  };
};

export default ScreenReaderAnnouncement; 