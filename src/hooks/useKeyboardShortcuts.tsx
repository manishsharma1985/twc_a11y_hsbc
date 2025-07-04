/**
 * Keyboard Shortcuts Hook
 * 
 * Provides keyboard shortcuts for enhanced accessibility and power user efficiency
 */

import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface KeyboardShortcut {
  key: string;
  description: string;
  action: () => void;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
}

export const useKeyboardShortcuts = (isEnabled = true) => {
  const navigate = useNavigate();
  const [shortcutsVisible, setShortcutsVisible] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  const announceShortcut = useCallback((message: string) => {
    setAnnouncement(message);
    setTimeout(() => setAnnouncement(''), 2000);
  }, []);

  // Define keyboard shortcuts
  const shortcuts: KeyboardShortcut[] = [
    // Navigation shortcuts
    {
      key: '1',
      altKey: true,
      description: 'Go to Home page',
      action: () => {
        navigate('/');
        announceShortcut('Navigating to Home page');
      }
    },
    {
      key: '2',
      altKey: true,
      description: 'Go to Request Form',
      action: () => {
        navigate('/request');
        announceShortcut('Navigating to Request Form');
      }
    },
    {
      key: '3',
      altKey: true,
      description: 'Go to Request History',
      action: () => {
        navigate('/history');
        announceShortcut('Navigating to Request History');
      }
    },

    // Skip navigation shortcuts
    {
      key: 'm',
      altKey: true,
      description: 'Skip to main content',
      action: () => {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.focus();
          mainContent.scrollIntoView({ behavior: 'smooth' });
          announceShortcut('Skipped to main content');
        }
      }
    },

    // Form shortcuts
    {
      key: 's',
      ctrlKey: true,
      description: 'Submit current form (Ctrl+S)',
      action: () => {
        const submitButton = document.querySelector('button[type="submit"]');
        if (submitButton) {
          (submitButton as HTMLButtonElement).click();
          announceShortcut('Form submitted');
        }
      }
    },

    // Help
    {
      key: '/',
      description: 'Show keyboard shortcuts help',
      action: () => {
        setShortcutsVisible(!shortcutsVisible);
        announceShortcut(shortcutsVisible ? 'Keyboard shortcuts hidden' : 'Keyboard shortcuts shown');
      }
    }
  ];

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isEnabled) return;

    // Don't trigger shortcuts when typing in form fields
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    const matchingShortcut = shortcuts.find(shortcut => {
      return shortcut.key.toLowerCase() === event.key.toLowerCase() &&
             !!shortcut.ctrlKey === event.ctrlKey &&
             !!shortcut.altKey === event.altKey &&
             !!shortcut.shiftKey === event.shiftKey;
    });

    if (matchingShortcut) {
      event.preventDefault();
      matchingShortcut.action();
    }
  }, [isEnabled, shortcuts, shortcutsVisible, announceShortcut, navigate]);

  useEffect(() => {
    if (isEnabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyDown, isEnabled]);

  return {
    shortcuts,
    shortcutsVisible,
    setShortcutsVisible,
    announcement
  };
};

// Screen reader announcement component for shortcuts
export const ShortcutAnnouncement: React.FC<{ message: string }> = ({ message }) => {
  if (!message) return null;
  
  return (
    <div
      role="status"
      aria-live="polite"
      className="sr-only"
      aria-label={`Keyboard shortcut: ${message}`}
    >
      {message}
    </div>
  );
}; 