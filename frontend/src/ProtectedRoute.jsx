import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

export default function ProtectedRoute({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Listen for changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div className="h-screen bg-[#020617] flex items-center justify-center text-white">Checking access...</div>;

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
}