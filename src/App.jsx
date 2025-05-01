import { RouterProvider } from 'react-router-dom';

// project imports
import router from 'routes';
import ThemeCustomization from 'themes';
import { SignedIn, SignedOut, SignIn, SignInButton, UserButton } from '@clerk/clerk-react';

import ScrollTop from 'components/ScrollTop';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  return (
    <ThemeCustomization>
      <ScrollTop>
        <SignedOut>
          <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    width: '100%', 
    height: '100vh' 
  }}>
            <SignIn />
          </div>
        </SignedOut>
        <SignedIn>
          <UserButton />
          
          <RouterProvider router={router} />
        </SignedIn>
      </ScrollTop>
    </ThemeCustomization>
  );
}
