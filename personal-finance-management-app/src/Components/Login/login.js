import { useNavigate } from 'react-router-dom';
import '../../assets/styles/loginform.css';
import { useContext, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { IS_LOGGEDIN } from '../store';
import { useMutation, gql } from '@apollo/client';

const Login = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password)
    
    
  }
`;

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, seterrorMessage] = useState('');
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const setLoginBoolValue = () =>{
    dispatch(IS_LOGGEDIN.checkLoggedIn('1'));
  }
  const [login] = useMutation(Login);

 
  const loginButtonClicked = async () => {
    if (username === '' || password === '' || username === null || password === null) {
      seterrorMessage("Cannot be Empty")
     }
    
   else  
    {    
   
    
    try {    
       const {data} = await login({ variables: { username:username, password:password } });
      const token = data.login;
      
      localStorage.setItem('token', token);
      console.log(token);
      setLoginBoolValue()
       
        navigate("/dashboard", {replace: true});
       
     
    } catch (err) {
      console.error(err);
    }
    
      
    }
   
    
    
  }



  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Personal Finance Manager</h1>
        <h2>Login</h2>

        <div className="form-group">
          <label>Username</label>
          <input type="text" placeholder="Enter your username" onChange={(e) => setUsername(e.target.value)} required/>
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} required/>
        </div>

        <div className="loginpage-button">
          <button type="button" onClick={ loginButtonClicked}>Login</button>
          <button type="button" onClick={()=> navigate('/register')} >Register</button>
        </div>
        <br/>
        <label style={{color:"red"}}>{errorMessage}</label>
      </div>
    </div>
  );
}

export default LoginForm;
