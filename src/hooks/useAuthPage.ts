"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from './useSupbaseAuth';


export default function useAuthPage() {
  const { user, loading, error:authError, supabase } = useSupabaseAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  useEffect(()=>{
    if(user){
      router.push('/dashboard');
    }
  },[user, router]);
  
  useEffect(() => {
    if (authError && authError !== 'Auth session missing!') {
      setError(authError || 'An error occurred during authentication.');
    }
  }, [authError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: { full_name: fullName },
          },
        });

        if (signUpError) throw signUpError;

        router.push(`/auth/check-email?email=${encodeURIComponent(email)}`);
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setError(err instanceof Error ? err.message : 'An error occurred during authentication.');
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    fullName,
    setFullName,
    isSignUp,
    setIsSignUp,
    error,
    handleSubmit,
  };
}
