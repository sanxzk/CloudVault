import { createContext, useContext, useEffect, useState,  } from 'react';
import type {ReactNode} from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isGuest: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, isGuest: false });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // check if a session already exists (e.g. on page refresh)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // listen for login/logout/token-refresh events
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Supabase marks users created via signInAnonymously() with is_anonymous = true
  const isGuest = user?.is_anonymous ?? false;

  return (
    <AuthContext.Provider value={{ user, loading, isGuest }} >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}