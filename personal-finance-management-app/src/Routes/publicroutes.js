import { createBrowserRouter, Outlet } from 'react-router-dom';
import Register from '../Components/Register/register';

const PublicRoutes = () =>{
  return (<div>
   
   
    <main>
        <Outlet/>
    </main>
    <hr/>
    
</div>)
  
  };

export default PublicRoutes;
