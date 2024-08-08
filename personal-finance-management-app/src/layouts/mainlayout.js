import {Outlet } from "react-router-dom";
import Header from "../Components/Header/header";



const MainLayout = () => {
    return (<div>
        <header>
            
            <Header/>
        </header>    
        
        <main>
            <Outlet/>
        </main> 
        
        

    </div>);
};

export default MainLayout;