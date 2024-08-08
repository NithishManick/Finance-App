
import { Navigate, Outlet } from 'react-router-dom';

import { useSelector } from 'react-redux';

const ProtectedRoutes = () => {
  
  const loggedIn = useSelector(state => state.isLoggedIn)
  console.log(loggedIn)

  return loggedIn === '1' ? <Outlet /> : <Navigate to="/unauthorizedaccess" />;
};


export default ProtectedRoutes;
