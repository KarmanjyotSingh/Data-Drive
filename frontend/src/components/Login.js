import React from "react";
import './Login.css';
import { Avatar} from '@mui/material';
import user_icon from '../Assets/user_icon.png';
import email_icon from '../Assets/email_icon.png';
import password_icon from '../Assets/password_icon.png';
import {useState} from 'react';
import LockIcon from '@mui/icons-material/Lock';
const Login = () => {

   
    const [action,setAction] = useState("Sign Up");
  
    return (
        
        <div className='container'>
      
        <div className="header">
       <Avatar><LockIcon/></Avatar>
        <div className="text">{action}</div>
        <div className="underline"></div>
        </div>
        <div className="inputs">
            {action==="Login"?<div></div>:<div className="input">
                <img src={user_icon} alt="" />
                <input type="text" placeholder="Name"/>
             </div>}
            
             <div className="input">
                <img src={email_icon} alt="" />
                <input type="email" placeholder="Email Id"/>
             </div>
             <div className="input">
                <img src={password_icon} alt="" />
                <input type="password" placeholder="Password"/>
             </div>
        </div>
        {action==="Sign Up"?<div></div>:<div className="forgot-password">Forgot Password?<span>Click Here</span></div>}
        
        <div className="submit-container">
           <div className={action==="Login"?"submit gray":"submit"} onClick={()=>{setAction("Sign Up")}}>Sign Up</div>
           <div className={action==="Sign Up"?"submit gray":"submit"} onClick={()=>{setAction("Login")}}>Login</div>
            </div>
        </div>
        
    );
}

export default Login