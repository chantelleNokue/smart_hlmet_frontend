import { lazy } from 'react';

// project imports
import AuthLayout from 'layout/Auth';
import Loadable from 'components/Loadable';
import { SignIn, SignUp } from '@clerk/clerk-react';

// jwt auth
const LoginPage = Loadable(lazy(() => import('pages/auth/Login')));
const RegisterPage = Loadable(lazy(() => import('pages/auth/Register')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <AuthLayout />,
      children: [
        {
          path: '/login',
          element: <SignIn />
        },
        {
          path: '/sign-up',
          element: <SignUp />
        }
      ]
    }
  ]
};

export default LoginRoutes;
