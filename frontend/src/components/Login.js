import React from "react";
import './Login.css';
import { Avatar, Button} from '@mui/material';
import user_icon from '../Assets/user_icon.png';
import email_icon from '../Assets/email_icon.png';
import password_icon from '../Assets/password_icon.png';
import {useState} from 'react';
import LockIcon from '@mui/icons-material/Lock';
import axios from 'axios';
import ls from "local-storage";

const Login = () => {
 
    const [action,setAction] = useState("Login");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [emailbool, setEmailbool] = React.useState(true);
    const [passwordbool, setPasswordbool] = React.useState(true);

    // save the user details in state
    const handleemail = (event) => {
        event.preventDefault();
        setEmail(event.target.value);
        // let regex =
        //   /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        // eslint-disable-next-line no-console
    
        // if (regex.test(event.target.value)) {
        //   setEmailbool(true);
        // } else {
        //   setEmailbool(false);
        // }
        if(event.target.value.length >= 6)
        {
            setEmailbool(true);
        }
        else
        {
            setEmailbool(false);
        }
      };
    
    const handlepassword = (event) => {
        event.preventDefault();
        setPassword(event.target.value);
        if (event.target.value.length >= 6) {
            setPasswordbool(true);
        }
        else {
            setPasswordbool(false);
        }
    };
    
    const handleSubmit = (event) => {
        event.preventDefault();
        if (action==="Login" && emailbool && passwordbool && email !== "" && password !== " ") 
        {
            console.log({
            email: email,
            password: password
            });
            axios
            .post("http://localhost:5000/login", {
                email: email,
                password: email,
            })
            .then(function (response) {
                console.log(response);
                alert("Login Successful");
                window.location = "/home";
                ls.set("email", email);
            })
            .catch(function (error) {
                console.log(error);
                alert("Login Failed");
            });
        } 
        else 
        {
            console.log(emailbool, passwordbool, email, password);
            if(emailbool === false)
            {
                alert("Invalid Email");
            }
            else if(passwordbool === false)
            {
                alert("Invalid Password");
            }
            else if(email === "" || password === "")
            {
                alert("Please fill all the fields");
            }
        }
    };

    return (
        <div className='container'>
            <div className="header">
                <Avatar><LockIcon/></Avatar>
                {/* <div className="text">{action}</div> */}
                <div className="submit-container">
                    <div className={action==="Login"?"submit gray":"submit"} onClick={()=>{setAction("Sign Up")}}>Sign Up</div>
                    <div className={action==="Sign Up"?"submit gray":"submit"} onClick={()=>{setAction("Login")}}>Login</div>
                </div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                {
                    action==="Login"?<div></div>:<div className="input">
                    <img src={user_icon} alt="" />
                    <input type="text" placeholder="Name"/>
                    </div>
                }
                <div className="input">
                    <img src={email_icon} alt="" />
                    <input type="email" placeholder="Email Id" onChange={handleemail} error={!emailbool}/>
                </div>
                <div className="input">
                    <img src={password_icon} alt="" />
                    <input type="password" placeholder="Password" onChange={handlepassword} error={!passwordbool}/>
                </div>
                <div className="submit-container">
                    <div className="submit" onClick={handleSubmit}>Submit</div>
                </div>
                {action==="Sign Up"?<div></div>:<div className="forgot-password"><span>Forgot Password?</span></div>}
            </div>
        </div>
    );
}

export default Login