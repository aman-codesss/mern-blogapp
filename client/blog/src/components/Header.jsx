import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../context/UserContext'


const Header = () => {
  const {userInfo, setUserInfo} = useContext(UserContext)
  const [isDark,setIsDark]=useState(false)
  useEffect(()=>{
    const fetchProfile = async()=>{
      const res = await fetch('http://localhost:4000/profile',{credentials: 'include'} )
      const userInfo = await res.json()
      setUserInfo(userInfo);
    }
    fetchProfile()
  },[])

  const logout =()=>{
    fetch('http://localhost:4000/logout',{credentials:'include',method: 'POST'})
    setUserInfo(null)
  }
   const username = userInfo?.username;
  return (
    
     <header>
          <Link to="/" className="logo">
            Aman's app
          </Link>
          <nav>

            {username && (
              <>
              <span className='welcome'>Welcome {username}</span>
              <Link to={'/create'}>Create new Post</Link>
              <Link onClick={logout}>Logout</Link>
              </>
            )}
            {!username && (
              <>
              <Link to="/login">Login</Link>
             <Link to={'/register'}>Register</Link>
              </>
            )}
          </nav>
    </header> 
    
  )
}

export default Header
