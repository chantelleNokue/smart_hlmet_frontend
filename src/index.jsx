import { createRoot } from 'react-dom/client';

// style.scss
import 'assets/style.css';

// scroll bar
import 'simplebar-react/dist/simplebar.min.css';

// apex-chart
import 'assets/third-party/apex-chart.css';
import 'assets/third-party/react-table.css';

// google-fonts
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/700.css';

import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

import '@fontsource/public-sans/400.css';
import '@fontsource/public-sans/500.css';
import '@fontsource/public-sans/600.css';
import '@fontsource/public-sans/700.css';
import React from 'react'

// project imports
import App from './App';
import reportWebVitals from './reportWebVitals';
import { EmergencyProvider } from './pages/component-overview/emergency-provider';
import { ClerkProvider } from '@clerk/clerk-react';

const container = document.getElementById('root');
const root = createRoot(container);

const PUBLISHABLE_KEY = "pk_test_ZmxleGlibGUtY2hpcG11bmstOTUuY2xlcmsuYWNjb3VudHMuZGV2JA"
// import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

// ==============================|| MAIN - REACT DOM RENDER ||============================== //

root.render(
         <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
          <EmergencyProvider>
          <App />
          </EmergencyProvider>
         
         </ClerkProvider>
        
    );
    
// <App />

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
