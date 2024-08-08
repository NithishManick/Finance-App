import { useNavigate } from 'react-router-dom';
import '../../assets/styles/loginform.css';
import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

const registerUserQuery = gql`
mutation registerUserQuery($username: String!, $password: String!, $email: String!) {
  register(username: $username, password: $password, email: $email)
}

`

const Register = () => {
  const [register] = useMutation(registerUserQuery);
    const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, seterrorMessage] = useState('');

  const navigate = useNavigate();

  const registerButtonClicked = async () => {
    if (username === '' || password === '' || username === null || password === null || email === '' || email === null) {
      seterrorMessage("Cannot be Empty")
     }
   
  
    else{
      const {data} = await register({ variables: { username:username, password:password,email:email } });

    
      navigate("/login");
    }
    
    
  }

  const emailValidation = (val) => {
    let regEmail = /[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/;
    if(!regEmail.test(val)){
      seterrorMessage( 'Invalid Email');
    }
    else{
        seterrorMessage( '');
        setEmail(val)
    }
  }
    return (
        <div className="login-page">
      <div className="login-container">
        <h1>Personal Finance Manager</h1>
        <h2>Register</h2>

        <div className="form-group">
          <label>Username</label>
          <input type="text" placeholder="Enter your username" onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" placeholder="Enter your email" onChange={(e) =>emailValidation(e.target.value) } />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} />
        </div>

        <div className="button-group">
          <button type="button" onClick={() => registerButtonClicked()}>Register</button>
        
        </div>
        <br/>
        <label style={{color:"red"}}>{errorMessage}</label>
      </div>
    </div>
    )
}

export default Register;