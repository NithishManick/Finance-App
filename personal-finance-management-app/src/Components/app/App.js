
import { RouterProvider } from 'react-router-dom';
import '../../assets/styles/App.css';
import { useState } from 'react';
import AppRoutes from '../../Routes/approutes';



function App() {
 


  return (
    
        <RouterProvider router={AppRoutes}>
      </RouterProvider>
   
  );
  
}

export default App;

