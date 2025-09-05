'use client';

import dynamic from 'next/dynamic';

// This is a client component that wraps the dynamic import
const ChatwootWidget = dynamic(
  () => import('./ChatwootWidget'),
  { 
    ssr: false,
    loading: () => null, // Optional: Show loading state if needed
  }
);

export default function ChatwootClient() {
  return <ChatwootWidget />;
}
