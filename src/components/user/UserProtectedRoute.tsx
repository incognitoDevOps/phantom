
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface UserProtectedRouteProps {
  children: React.ReactNode;
}

export const UserProtectedRoute: React.FC<UserProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const isUserAuthenticated = localStorage.getItem('userAuthenticated') === 'true';
        const userRole = localStorage.getItem('userRole');
        
        if (!session || !isUserAuthenticated || userRole !== 'user') {
          navigate('/user/login');
          return;
        }
        
        // Verify the session is still valid
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
          localStorage.removeItem('userAuthenticated');
          localStorage.removeItem('userPhone');
          localStorage.removeItem('userRole');
          localStorage.removeItem('userId');
          navigate('/user/login');
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('userAuthenticated');
        localStorage.removeItem('userPhone');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        navigate('/user/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        localStorage.removeItem('userAuthenticated');
        localStorage.removeItem('userPhone');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        navigate('/user/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
