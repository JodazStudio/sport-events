import { create } from 'zustand';
import { supabase } from '@/lib';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';

export type Role = 'superadmin' | 'admin';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  role: Role | null;
  
  // Actions
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setRole: (role: Role | null) => void;
  setLoading: (isLoading: boolean) => void;
  
  // Auth procedures
  initializeAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  fetchUserProfile: (session: Session) => Promise<any>;
}

/**
 * Zustand store to manage platform authentication and roles.
 * Fetches the user profile via an internal API route for security.
 */
export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  role: null,

  setSession: (session) => set({ session }),
  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),
  setLoading: (isLoading) => set({ isLoading }),

  /**
   * Helper to fetch the user profile from the internal API
   */
  fetchUserProfile: async (session: Session) => {
    try {
      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const profile = await response.json();
      return profile;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  },

  initializeAuth: async () => {
    set({ isLoading: true });
    
    // 1. Get initial session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      const profile = await get().fetchUserProfile(session);
      const role = profile?.role as Role || (session.user.app_metadata?.role as Role) || 'admin';
      
      set({ 
        session, 
        user: session.user, 
        role,
        isLoading: false 
      });
    } else {
      set({ isLoading: false });
    }

    // 2. Listen for auth changes
    supabase.auth.onAuthStateChange(async (_event: AuthChangeEvent, session: Session | null) => {
      if (session) {
        const profile = await get().fetchUserProfile(session);
        const role = profile?.role as Role || (session.user.app_metadata?.role as Role) || 'admin';
        set({ session, user: session.user, role, isLoading: false });
      } else {
        set({ session: null, user: null, role: null, isLoading: false });
      }
    });
  },

  login: async (email, password) => {
    set({ isLoading: true });
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      set({ isLoading: false });
      return { error: error.message };
    }

    if (data.session) {
      const profile = await get().fetchUserProfile(data.session);
      const role = profile?.role as Role || (data.user.app_metadata?.role as Role) || 'admin';
      
      set({ 
        session: data.session, 
        user: data.user, 
        role, 
        isLoading: false
      });
    }
    
    return { error: null };
  },

  logout: async () => {
    set({ isLoading: true });
    await supabase.auth.signOut();
  },
}));
