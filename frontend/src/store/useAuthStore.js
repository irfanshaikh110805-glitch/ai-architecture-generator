import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase, authHelpers } from '../lib/supabase';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // Auth state
      session: null,
      user: null,
      isAuthenticated: false,
      loading: true,

      // Initialize auth state from Supabase
      initialize: async () => {
        try {
          const session = await authHelpers.getSession();
          if (session) {
            set({
              session,
              user: session.user,
              isAuthenticated: true,
              loading: false,
            });
          } else {
            set({ loading: false });
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          set({ loading: false });
        }
      },

      // Sign up with email and password
      signUp: async (email, password, metadata = {}) => {
        try {
          const { session, user } = await authHelpers.signUp(email, password, metadata);
          
          set({
            session,
            user,
            isAuthenticated: !!session,
          });
          
          return { success: true, user };
        } catch (error) {
          console.error('Signup error:', error);
          return { success: false, error: error.message };
        }
      },

      // Sign in with email and password
      signIn: async (email, password) => {
        try {
          const { session, user } = await authHelpers.signIn(email, password);
          
          set({
            session,
            user,
            isAuthenticated: true,
          });
          
          return { success: true, user };
        } catch (error) {
          console.error('Login error:', error);
          return { success: false, error: error.message };
        }
      },

      // Sign out
      signOut: async () => {
        try {
          await authHelpers.signOut();
          set({
            session: null,
            user: null,
            isAuthenticated: false,
          });
          return { success: true };
        } catch (error) {
          console.error('Logout error:', error);
          return { success: false, error: error.message };
        }
      },

      // Update user
      updateUser: async (updates) => {
        try {
          const { user } = await authHelpers.updateUser(updates);
          set({
            user,
          });
          return { success: true, user };
        } catch (error) {
          console.error('Update user error:', error);
          return { success: false, error: error.message };
        }
      },

      // Reset password
      resetPassword: async (email) => {
        try {
          await authHelpers.resetPassword(email);
          return { success: true };
        } catch (error) {
          console.error('Reset password error:', error);
          return { success: false, error: error.message };
        }
      },

      // Set authentication (for backward compatibility)
      setAuth: (session, user) => {
        set({
          session,
          user,
          isAuthenticated: true,
        });
      },

      // Get access token
      getAccessToken: () => {
        const { session } = get();
        return session?.access_token || null;
      },

      // Get auth header
      getAuthHeader: () => {
        const token = get().getAccessToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
      },

      // Check if token is expired
      isTokenExpired: () => {
        const { session } = get();
        if (!session) return true;

        try {
          const expirationTime = session.expires_at * 1000;
          return Date.now() >= expirationTime;
        } catch (error) {
          console.error('Error checking token expiration:', error);
          return true;
        }
      },

      // Refresh session
      refreshSession: async () => {
        if (!supabase) {
          return { success: false, error: 'Supabase not configured' };
        }
        
        try {
          const { data, error } = await supabase.auth.refreshSession();
          if (error) throw error;
          
          if (data.session) {
            set({
              session: data.session,
              user: data.session.user,
              isAuthenticated: true,
            });
          }
          
          return { success: true };
        } catch (error) {
          console.error('Refresh session error:', error);
          return { success: false, error: error.message };
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        session: state.session,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Set up auth state listener only if Supabase is configured
if (supabase) {
  authHelpers.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event);
    
    if (session) {
      useAuthStore.setState({
        session,
        user: session.user,
        isAuthenticated: true,
      });
    } else {
      useAuthStore.setState({
        session: null,
        user: null,
        isAuthenticated: false,
      });
    }
  });
} else {
  console.warn('Supabase not configured. Using FastAPI authentication only.');
}

export default useAuthStore;
