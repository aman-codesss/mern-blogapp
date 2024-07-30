import React, { useState } from 'react'
import styles from '../styles/login.module.css'

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleRegister=async(e)=>{
    e.preventDefault()
 
     const res = await fetch('http://localhost:4000/register',{
        method:'POST',
        body: JSON.stringify({username,password}),
        headers:{'Content-Type':'application/json'}
      })
    
      if(res.status===200){
        alert("logged in successfully")
      }
      else{
        alert("Login in failed, try again.")
      }
    setUsername("")
    setPassword("")
  }
  return (
    <div className='login'>
    <h3>Register Page</h3>
    <form action="" onSubmit={handleRegister}>
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
        <button className="btn">Register</button>
      </form>
</div>
  )
}

export default Register
