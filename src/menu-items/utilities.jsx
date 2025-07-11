// assets
import {
  AppstoreAddOutlined,
  AntDesignOutlined,
  BarcodeOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  LoadingOutlined,
  UserOutlined,
  BellOutlined,
  HistoryOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons';
import { TbBrandGoogleAnalytics } from "react-icons/tb";
import { GiMiningHelmet } from "react-icons/gi";
import { Badge } from 'antd';
import { useUser } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';

// icons
const icons = {
  FontSizeOutlined,
  BgColorsOutlined,
  BarcodeOutlined,
  AntDesignOutlined,
  LoadingOutlined,
  AppstoreAddOutlined,
  UserOutlined,
  BellOutlined,
  HistoryOutlined,
  TbBrandGoogleAnalytics,
  UsergroupAddOutlined,
  GiMiningHelmet
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //
const Utilities = () => {
  const { user } = useUser();
  const [menuItems, setMenuItems] = useState([]);
 
  useEffect(() => {
    const userRole = user?.publicMetadata?.role || user?.privateMetadata?.role || 'member';
    console.log('User role:', userRole);
    const commonMenuItems = [
      {
        id: 'utilities-common',
        title: 'Utilities',
        type: 'group',
        children: [
          {
            id: 'util-historical',
            title: 'Miners Monitoring',
            type: 'item',
            url: '/historical-data',
            icon: icons.HistoryOutlined
          },
          {
            id: 'util-analytics',
            title: 'Analytics',
            type: 'item',
            url: '/analytics',
            icon: icons.TbBrandGoogleAnalytics
          },
          {
            id: 'util-alerts',
            title: 'Alerts',
            type: 'item',
            url: '/alert',
            icon: icons.BellOutlined,
            // breadcrumbs: false
          },
           {
            id: 'util-settings',
            title: 'Settings',
            type: 'item',
            url: '/settings',
            icon: icons.BellOutlined,
            // breadcrumbs: false
          }
        ]
      }
    ];

    const adminOnlyItems = [
      {
        id: 'utilities-admin',
        title: 'Admin Utilities',
        type: 'group',
        children: [
          {
            id: 'util-staff',
            title: 'Staff',
            type: 'item',
            url: '/staff',
            icon: icons.UserOutlined
          },
          {
            id: 'util-user-management',
            title: 'User Management',
            type: 'item',
            url: '/user-management',
            icon: icons.UsergroupAddOutlined,
            // breadcrumbs: false
          },
          {
            id: 'util-helmets',
            title: 'Helmets',
            type: 'item',
            url: '/helmets', 
            icon: icons.GiMiningHelmet
          },
        ]
      }
    ];

    if (userRole === 'admin') {
      setMenuItems([...adminOnlyItems, ...commonMenuItems]);
    } else if (userRole === 'control_room_operator') {
      setMenuItems(commonMenuItems);
    } else {
      setMenuItems([]);
    }
  }, [user]);

  console.log(menuItems)

  return menuItems;
};

export default Utilities;


