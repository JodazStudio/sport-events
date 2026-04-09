import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';

export type Role = 'superadmin' | 'admin';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  role: Role | null;
  impersonatedAdminId: string | null;
  
  // Actions
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setRole: (role: Role | null) => void;
  setLoading: (isLoading: boolean) => void;
  
  // Auth procedures
  initializeAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  
  // God Mode (Impersonation)
  startImpersonation: (adminId: string) => void;
  stopImpersonation: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  role: null,
  impersonatedAdminId: null,

  setSession: (session) => set({ session }),
  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),
  setLoading: (isLoading) => set({ isLoading }),

  initializeAuth: async () => {
    set({ isLoading: true });
    
    // Get initial session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      const user = session.user;
      // Extract role from app_metadata or user_metadata
      const role = (user.app_metadata?.role as Role) || (user.user_metadata?.role as Role) || 'admin';
      
      set({ 
        session, 
        user, 
        role,
        isLoading: false 
      });
    } else {
      set({ isLoading: false });
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const user = session.user;
        const role = (user.app_metadata?.role as Role) || (user.user_metadata?.role as Role) || 'admin';
        set({ session, user, role, isLoading: false });
      } else {
        set({ session: null, user: null, role: null, impersonatedAdminId: null, isLoading: false });
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
      const user = data.user;
      const role = (user.app_metadata?.role as Role) || (user.user_metadata?.role as Role) || 'admin';
      
      set({ 
        session: data.session, 
        user, 
        role, 
        isLoading: false,
        impersonatedAdminId: null 
      });
    }
    
    return { error: null };
  },

  logout: async () => {
    set({ isLoading: true });
    await supabase.auth.signOut();
    // onAuthStateChange will handle the state reset
  },

  startImpersonation: (adminId) => {
    set((state) => {
      if (state.role !== 'superadmin') return state;
      return { impersonatedAdminId: adminId };
    });
  },

  stopImpersonation: () => {
    set({ impersonatedAdminId: null });
  },
}));
