// material-ui
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import NavGroup from './NavGroup';
import MenuItems from '../../../../../menu-items';
import Utilities from '../../../../../menu-items/utilities';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

export default function Navigation() {
  const menuItems = MenuItems();
  const utilities = Utilities(); // This correctly uses the React hooks
  
  // Create a combined array of items
  const allItems = [...menuItems.items];
  
  // Only add utilities if it exists (has an id)
  if (utilities && utilities.id) {
    allItems.push(utilities);
  }
  
  const navGroups = allItems.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Fix - Navigation Group
          </Typography>
        );
    }
  });

  return <Box sx={{ pt: 2 }}>{navGroups}</Box>;
}
