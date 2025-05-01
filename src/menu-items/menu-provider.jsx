// // MenuProvider.jsx - Create a context provider to manage menu state
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useUser } from '@clerk/clerk-react';

// // Import your original menu items
// import dashboard from './dashboard';
// import pages from './page';
// import support from './support';
// import { getUtilitiesForRole } from './utilities';

// // Create context
// const MenuContext = createContext();

// export const useMenu = () => useContext(MenuContext);

// export const MenuProvider = ({ children }) => {
//   const { user } = useUser();
//   const [menuItems, setMenuItems] = useState({
//     items: [dashboard, pages, support] // Initialize with static routes
//   });
  
//   useEffect(() => {
//     if (!user) return;
    
//     // Get user role from metadata
//     const userRole = user?.publicMetadata?.role || user?.privateMetadata?.role || 'member';
    
//     // Generate utility menu based on role
//     const utilityMenu = getUtilitiesForRole(userRole);
    
//     // Update menu items
//     setMenuItems({
//       items: [dashboard, pages, utilityMenu, support]
//     });
    
//     console.log('Updated menu items with role:', userRole);
//   }, [user]);
  
//   return (
//     <MenuContext.Provider value={{ menuItems }}>
//       {children}
//     </MenuContext.Provider>
//   );
// };