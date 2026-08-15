import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isOnboarded: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signInWithLinkedIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Check user data after state update
          setTimeout(() => {
            checkUserRoleAndProfile(session.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
          setIsOnboarded(false);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        checkUserRoleAndProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserRoleAndProfile = async (userId: string) => {
    try {
      // Check admin role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      setIsAdmin(!!roleData);

      // Check onboarding status
      const { data: profileData } = await supabase
        .from('profiles')
        .select('is_onboarded')
        .eq('user_id', userId)
        .maybeSingle();

      setIsOnboarded(!!profileData?.is_onboarded);
    } catch (error) {
      console.error('Error checking user details:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) throw new Error('Account access is not enabled in this preview.');
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      throw error;
    }

    toast.success('Signed in successfully');
    navigate('/admin');
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    if (!isSupabaseConfigured) throw new Error('Account access is not enabled in this preview.');
    const redirectUrl = `${window.location.origin}/`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          display_name: displayName,
        },
      },
    });

    if (error) {
      toast.error(error.message);
      throw error;
    }

    if (data.user) {
      // Create profile
      await supabase.from('profiles').insert({
        user_id: data.user.id,
        display_name: displayName,
      });

      toast.success('Account created successfully');
      navigate('/admin');
    }
  };

  const signInWithLinkedIn = async () => {
    if (!isSupabaseConfigured) throw new Error('LinkedIn sign-in is not enabled in this preview.');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'linkedin_oidc',
      options: {
        redirectTo: `${window.location.origin}/community`,
      },
    });

    if (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const signOut = async () => {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error(error.message);
      throw error;
    }

    toast.success('Signed out successfully');
    navigate('/auth');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        isOnboarded,
        loading,
        signIn,
        signUp,
        signInWithLinkedIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
