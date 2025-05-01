import dashboard from './dashboard';
import pages from './page';
import support from './support';
import Utilities from './utilities';

const MenuItems = () => {
  const utilities = Utilities();
  
  // If utilities is an array, spread it into the items array
  // Otherwise, your other components (dashboard, pages, support) are likely individual objects
  const items = [dashboard, pages, support];
  
  // Add utilities items if they exist
  if (utilities && utilities.length > 0) {
    items.push(...utilities);
  }

  return {
    items: items
  };
};

export default MenuItems;