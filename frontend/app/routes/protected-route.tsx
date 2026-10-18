import { useMount } from '@siberiacancode/reactuse';
import { useState } from 'react';
import { Navigate, Outlet } from 'react-router';

import { useAuth } from '@/contexts';
import { Footer, Header } from '@/layout';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);

  useMount(() => setMounted(true));

  if (!mounted) return null;

  if (!isAuthenticated) {
    return <Navigate replace to='/auth' />;
  }

  return (
    <div className='relative'>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default ProtectedRoute;
