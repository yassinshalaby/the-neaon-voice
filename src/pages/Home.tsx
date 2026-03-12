import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, User, Loader2 } from 'lucide-react';
import type { User as AuthUser } from '@supabase/supabase-js';

export default function Home() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-neutral-950 overflow-hidden">
      {/* Top Header */}
      <header className="h-16 flex-shrink-0 border-b border-neutral-800 bg-neutral-900 flex items-center justify-between px-4 sm:px-6 relative z-10 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="text-white font-bold tracking-tight text-lg">Neon Voice</div>
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2 text-sm text-neutral-300">
                <User className="w-4 h-4" />
                <span>{user.user_metadata?.full_name || user.email || 'User'}</span>
              </div>
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-2 text-neutral-400 hover:text-red-400 text-sm font-medium transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-neutral-300 hover:text-white text-sm font-medium transition-colors">
                Log In
              </Link>
              <Link to="/signup" className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area - Iframe to Original App */}
      <main className="flex-1 w-full bg-[#0A0A0A] relative">
        <iframe 
          src="/app.html" 
          title="Neon Fuse Main App" 
          className="absolute inset-0 w-full h-full border-none"
          allow="microphone"
        ></iframe>
      </main>
    </div>
  );
}
