import React, { useEffect, useState } from 'react'
import Posts from './Posts'
import { techArticles } from '../lib/tech'
const PostsAll = () => {
  const [posts,setPosts]=useState([])
  useEffect(()=>{
    const getPosts = async()=>{

      const res = await fetch("http://localhost:4000/post");
      const posts = await res.json()
      setPosts(posts)
    };
    getPosts()
  },[])
  return (
    <div className='allPosts'>
      <div className="left">

      {posts.length>0 && posts.map((post)=>(
        
        
        <div key={post._id}>

          <Posts {...post}/>

          </div>
            
            
            ))}
          </div>
          <div className="right">
            <div className="text">

            <span>Welcome to the world's </span><span className='best'>best blogap,</span>
            <span className="final">where you can immerse yourself in exceptional writings from world-class authors.</span>
            </div>
          </div>
    </div>
  )
}

export default PostsAll
