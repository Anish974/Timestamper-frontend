import { useCallback, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabaseClient } from '../lib/supabaseClient';

interface User {
  id: string;
  email: string;
  fullName?: string;
  avatar_url?: string; // ✅ Matches your DB column
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false); // Action loading
  const [initialLoading, setInitialLoading] = useState(true); // Session check
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const signUp = useCallback(
    async (email: string, password: string, fullName: string) => {
      try {
        setError(null);
        setLoading(true);

        const { data: authData, error: authError } = await supabaseClient.auth.signUp({
          email,
          password,
        });

        if (authError) throw authError;

        const userId = authData.user?.id;
        if (!userId) throw new Error('Failed to get user ID');

        // ✅ FIXED: Use correct DB columns
        const { error: profileError } = await supabaseClient
          .from('users')
          .insert({
            id: userId,
            email,
            full_name: fullName,     // ✅ DB column
            avatar_url: null,        // ✅ DB column
          });

        if (profileError) throw profileError;

        // ✅ FIXED: Match your schema exactly
        const { error: subError } = await supabaseClient
          .from('user_subscriptions')
          .insert({
            user_id: userId,         // ✅ DB column
            plan: 'Free',
            status: 'active',
            exports_used: 0,
            exports_limit: 3,        // ✅ Your schema field
          });

        if (subError) throw subError;

        // ✅ FIXED: Set user state correctly
        setUser({
          id: userId,
          email,
          fullName,                // Frontend uses camelCase
          avatar_url: null,
        });

        toast.success('Account created! Please check your email.');
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Signup failed';
        setError(message);
        console.error('Signup error:', err);
        toast.error(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        setError(null);
        setLoading(true);

        const { data, error: signInError } = await supabaseClient.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        const userId = data.user?.id;
        if (!userId) throw new Error('Failed to get user ID');

        // ✅ FIXED: Fetch complete profile
        let { data: profile, error: profileError } = await supabaseClient
          .from('users')
          .select('email, full_name, avatar_url')
          .eq('id', userId)
          .single();

        // ✅ If profile doesn't exist, create it
        if (profileError && profileError.code === 'PGRST116') {
          await supabaseClient
            .from('users')
            .insert({
              id: userId,
              email: data.user?.email || '',
              full_name: '',
              avatar_url: null,
            });

          const { data: newProfile } = await supabaseClient
            .from('users')
            .select('email, full_name, avatar_url')
            .eq('id', userId)
            .single();
          profile = newProfile;
        } else if (profileError) {
          throw profileError;
        }

        if (!profile) throw new Error('Failed to fetch profile');

        // ✅ Ensure subscription exists
        const { data: existingSub } = await supabaseClient
          .from('user_subscriptions')
          .select('id')
          .eq('user_id', userId)
          .single();

        if (!existingSub) {
          await supabaseClient
            .from('user_subscriptions')
            .insert({
              user_id: userId,
              plan: 'Free',
              status: 'active',
              exports_used: 0,
              exports_limit: 3,
            });
        }

        // ✅ FIXED: Map DB fields to frontend
        setUser({
          id: userId,
          email: profile.email,
          fullName: profile.full_name,
          avatar_url: profile.avatar_url,
        });

        toast.success('Welcome back!');
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Sign in failed';
        setError(message);
        console.error('Sign in error:', err);
        toast.error(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      await supabaseClient.auth.signOut();
      setUser(null);
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign out failed';
      setError(message);
      console.error('Sign out error:', err);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const checkSession = useCallback(async () => {
    setInitialLoading(true);
    try {
      const { data } = await supabaseClient.auth.getSession();
      if (data.session?.user) {
        const userId = data.session.user.id;
        
        // ✅ FIXED: Fetch profile with better error handling
        const { data: profile, error } = await supabaseClient
          .from('users')
          .select('email, full_name, avatar_url')
          .eq('id', userId)
          .single();

        if (error) {
          // ✅ If profile doesn't exist but user is authenticated, create it
          if (error.code === 'PGRST116') {
            // Profile doesn't exist, create it with default values
            const { error: insertError } = await supabaseClient
              .from('users')
              .insert({
                id: userId,
                email: data.session.user.email || '',
                full_name: '',
                avatar_url: null,
              });

            if (!insertError) {
              // Fetch again after creating
              const { data: newProfile } = await supabaseClient
                .from('users')
                .select('email, full_name, avatar_url')
                .eq('id', userId)
                .single();

              if (newProfile) {
                setUser({
                  id: userId,
                  email: newProfile.email,
                  fullName: newProfile.full_name,
                  avatar_url: newProfile.avatar_url,
                });
              }
            } else {
              console.error('Failed to create profile:', insertError);
              await supabaseClient.auth.signOut();
            }
          } else {
            // Other database error
            console.error('Profile fetch error:', error);
            await supabaseClient.auth.signOut();
          }
        } else if (profile) {
          setUser({
            id: userId,
            email: profile.email,
            fullName: profile.full_name,
            avatar_url: profile.avatar_url,
          });
        }
      }
    } catch (err) {
      console.error('Session check error:', err);
    } finally {
      setInitialLoading(false);
    }
  }, []);

  // ✅ Auto-check session on mount
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return {
    user,
    loading,           // Action loading (signup/signin)
    initialLoading,    // Session check loading
    error,
    signUp,
    signIn,
    signOut,
    checkSession,
  };
};
