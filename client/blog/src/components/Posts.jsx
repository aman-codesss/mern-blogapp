import React from 'react'
import {format} from 'date-fns'
import { Link } from 'react-router-dom'


const Posts = ({_id,title,content,summary,cover,createdAt,author}) => {
  return (
    <>
<div className="post">
<div className="image-container">
  <Link to={`post/${_id}`}>
  <img src={`http://localhost:4000/${cover}`} alt="tech-image" />
  </Link>
</div>

<div className="texts">
  <Link to={`post/${_id}`}>
  <h3>{title} -{author.username}</h3>
  </Link>
  <div className="info">

  <span className="date">{format(new Date(createdAt), 'do MMM yyyy - hh:mm bbb')}</span>

  </div>
  <p>
   {summary}
  </p>
</div>
</div>
    </>
  )
}

export default Posts
