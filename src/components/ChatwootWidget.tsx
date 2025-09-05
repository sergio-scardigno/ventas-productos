'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    chatwootSDK?: {
      run: (config: { websiteToken: string; baseUrl: string }) => void;
    };
  }
}

export default function ChatwootWidget() {
  useEffect(() => {
    const CHATWOOT_URL = 'http://192.168.57.6';
    
    console.log('ChatwootWidget: Initializing...');
    
    // Check if the script is already added
    if (window.chatwootSDK) {
      console.log('ChatwootWidget: SDK already loaded');
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = `${CHATWOOT_URL}/packs/js/sdk.js`;
    script.async = true;
    script.defer = true;

    // Initialize Chatwoot when script loads
    script.onload = () => {
      console.log('ChatwootWidget: Script loaded, initializing...');
      if (window.chatwootSDK) {
        try {
          console.log('ChatwootWidget: Running SDK with URL:', CHATWOOT_URL);
          window.chatwootSDK.run({
            websiteToken: 'kaV7Tzronhk6X8wmrpbNzBsX',
            baseUrl: CHATWOOT_URL
          });
          console.log('ChatwootWidget: Initialization successful');
        } catch (error) {
          console.error('ChatwootWidget: Error initializing:', error);
        }
      } else {
        console.error('ChatwootWidget: chatwootSDK not found on window object');
      }
    };

    // Handle script loading errors
    script.onerror = (error) => {
      console.error('ChatwootWidget: Failed to load script:', error);
    };

    // Add script to document
    console.log('ChatwootWidget: Adding script to document');
    document.body.appendChild(script);

    // Cleanup function to remove script on component unmount
    return () => {
      console.log('ChatwootWidget: Cleaning up');
      const scripts = document.querySelectorAll('script[src*="chatwoot"]');
      scripts.forEach(script => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    };
  }, []);

  return null;
}
