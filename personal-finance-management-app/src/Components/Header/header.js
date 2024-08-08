import { NavLink } from "react-router-dom";
import '../../assets/styles/header.css';
import { useDispatch } from "react-redux";
import { IS_LOGGEDIN } from '../store';


const Header = () => {
    const dispatch = useDispatch();
  
    return (
        <div className='header'>
            <h1>Personal Finance Manager</h1>
            <ul className='nav-links'>
                <li><NavLink to='/dashboard' >Dashboard</NavLink></li>
                <li><NavLink to='/transactionform' >Add/Edit Transaction</NavLink></li>
                <li><NavLink to='/transactionlist' >All Transactions</NavLink></li>

                <li><NavLink to='/login' onClick={() => {
                     dispatch(IS_LOGGEDIN.checkLoggedIn(0
                       
                     ));
                     localStorage.removeItem('token')
                    
                   
                }} >Logout</NavLink></li>
            </ul>
           


            
        </div>
    );
}

export default Header;


