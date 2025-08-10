// Shared authentication synchronization utility
// This helps ensure consistent login state across different pages

(function() {
  'use strict';
  
  // Check if user is authenticated and broadcast to other tabs
  function checkAuthState() {
    if (typeof firebase !== 'undefined' && firebase.auth) {
      const auth = firebase.auth();
      
      auth.onAuthStateChanged((user) => {
        const authState = {
          isAuthenticated: !!user,
          user: user ? {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
          } : null,
          timestamp: Date.now()
        };
        
        // Store auth state in localStorage for cross-tab communication
        localStorage.setItem('carbon_auth_state', JSON.stringify(authState));
        
        // Broadcast to other tabs
        window.dispatchEvent(new CustomEvent('carbon_auth_change', {
          detail: authState
        }));
      });
    }
  }
  
  // Listen for auth state changes from other tabs
  function listenForAuthChanges() {
    window.addEventListener('storage', (e) => {
      if (e.key === 'carbon_auth_state' && e.newValue) {
        try {
          const authState = JSON.parse(e.newValue);
          window.dispatchEvent(new CustomEvent('carbon_auth_sync', {
            detail: authState
          }));
        } catch (error) {
          console.warn('Failed to parse auth state from storage:', error);
        }
      }
    });
    
    // Also listen for same-tab auth changes
    window.addEventListener('carbon_auth_change', (e) => {
      console.log('Auth state changed:', e.detail);
    });
  }
  
  // Get current auth state from localStorage
  function getCurrentAuthState() {
    try {
      const stored = localStorage.getItem('carbon_auth_state');
      if (stored) {
        const authState = JSON.parse(stored);
        // Only use if it's recent (within 5 minutes)
        if (Date.now() - authState.timestamp < 300000) {
          return authState;
        }
      }
    } catch (error) {
      console.warn('Failed to get auth state from storage:', error);
    }
    return null;
  }
  
  // Initialize auth synchronization
  function initAuthSync() {
    checkAuthState();
    listenForAuthChanges();
  }
  
  // Expose utilities globally
  window.CarbonAuth = {
    initSync: initAuthSync,
    getCurrentState: getCurrentAuthState
  };
  
  // Auto-initialize if Firebase is already loaded
  if (typeof firebase !== 'undefined') {
    initAuthSync();
  } else {
    // Wait for Firebase to load
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(initAuthSync, 100);
    });
  }
})();