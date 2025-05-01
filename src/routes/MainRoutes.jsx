import { lazy, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import { UserProfile } from '@clerk/clerk-react';
import UserManagement from '../pages/user-management/UserManagement';

// Render components
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));
const Staff = Loadable(lazy(() => import('pages/staff/Staff')));
const Alerts = Loadable(lazy(() => import('pages/notifications2/page')));
const Analytics = Loadable(lazy(() => import('pages/analytics/page.jsx')));
const HistoricalData = Loadable(lazy(() => import('pages/historicalData/HistoricalData')));
const MiningDashboardApp = Loadable(lazy(() => import('pages/dashboard/dashboard2')));
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

// Protected route components
const AdminRoute = ({ children }) => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isLoaded) {
      const userRole = user?.publicMetadata?.role || user?.privateMetadata?.role || 'member';
      if (userRole !== 'admin') {
        navigate('/dashboard/default');
      }
    } 
  }, [isLoaded, user, navigate]);
  
  return children;
};

// ==============================|| MAIN ROUTING ||============================== // 

const MainRoutes = {
  path: '/',
  element: <DashboardLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'staff',
      element: <AdminRoute><Staff /></AdminRoute>
    },
    {
      path: 'historical-data',
      element: <HistoricalData />
    },
    {
      path: '/dashboard/MiningDashboardApp',
      element: <MiningDashboardApp />
    },
    {
      path: '/analytics',
      element: <Analytics />
    },
    {
      path: '/alert',
      element: <Alerts />
    },
    {
      path: '/profile',
      element: <UserProfile />
    },
    {
      path: '/user-management',
      element: <AdminRoute><UserManagement /></AdminRoute>
    },
    {
      path: 'sample-page',
      element: <AdminRoute><SamplePage /></AdminRoute>
    }
  ]
};

export default MainRoutes;