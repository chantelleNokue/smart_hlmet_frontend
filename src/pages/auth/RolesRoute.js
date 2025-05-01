import PropTypes from 'prop-types';
import { useUser } from '@clerk/clerk-react';
import Page403 from './Page403';

export const RolesRoute = ({ roles, children, ...rest }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  
  // Show loading or nothing while Clerk is loading
  if (!isLoaded) {
    return null; // or a loading spinner
  }
  
  // Handle user not found or not signed in
  // if (!isSignedIn || !user) {
  //   return <Page404User />;
  // }
  
  // Check if user has the required role
  // Assuming user.publicMetadata.roles contains an array of user roles
  const hasRequiredRole = () => {
    const userRoles = user.publicMetadata?.roles || [];
    return roles.some(role => userRoles.includes(role));
  };
  
  // Render children if user has required role, otherwise show 403
  return (
    <>
      {hasRequiredRole() ? children : <Page403 />}
    </>
  );
};

RolesRoute.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.node.isRequired
};