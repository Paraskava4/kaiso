"use client";

import React from 'react';

class HydrationErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Check if this is a hydration error
    if (error?.message?.includes('hydration') || 
        error?.message?.includes('server rendered HTML') ||
        error?.message?.includes('client properties')) {
      return { hasError: true, error };
    }
    
    // For other errors, let them bubble up
    return null;
  }

  componentDidCatch(error, errorInfo) {
    // Log hydration errors for debugging
    if (error?.message?.includes('hydration')) {
      console.warn('Hydration error caught:', error, errorInfo);
      
      // In development, provide more helpful information
      if (process.env.NODE_ENV === 'development') {
        console.warn('This is likely caused by:');
        console.warn('1. Browser extensions modifying the DOM');
        console.warn('2. Server/client rendering differences');
        console.warn('3. Dynamic content that changes between renders');
      }
    }
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI for hydration errors
      return this.props.fallback || (
        <div style={{ 
          padding: '20px', 
          border: '1px solid #ccc', 
          borderRadius: '4px',
          backgroundColor: '#f9f9f9',
          margin: '10px 0'
        }}>
          <p>Content is loading...</p>
          <small>If this persists, try disabling browser extensions.</small>
        </div>
      );
    }

    return this.props.children;
  }
}

export default HydrationErrorBoundary;
