import React, { useContext, useState } from "react";
import styles from "../styles/login.module.css";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect]=useState(false)
  const {setUserInfo} = useContext(UserContext)
  const handleLogin=async(e)=>{
    e.preventDefault()
 
     const res = await fetch('http://localhost:4000/login',{
        method:'POST',
        body: JSON.stringify({username,password}),
        headers:{'Content-Type':'application/json'},
      credentials:'include',//include credentials like cookies in the request
      });
      if(res.ok){
        const info = await res.json()
        setUserInfo(info)
        setRedirect(true)
      }
      else{
        alert("Wrong credentials.")
      }
      
   
  }
    if(redirect)
       return <Navigate to={'/'}/>
  

  return (
    <div className="login">
      <h3>Login Page</h3>
      <form action="" onSubmit={handleLogin}>
        <input
          type="text"
          name="username"
          id=""
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input type="password" name="password" id="" placeholder="password" 
         value={password}
         onChange={(e) => setPassword(e.target.value)}/>
        <button className="btn">Login</button>
      </form>
    </div>
  );
};

export default Login;
