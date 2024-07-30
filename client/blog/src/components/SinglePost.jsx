import React, { useContext, useEffect, useState } from "react";
import { Link, Navigate, redirect, useParams } from "react-router-dom";
import styles from "../styles/singlePost.module.css";
import { format } from "date-fns";
import { UserContext } from "../context/UserContext";

const SinglePost = () => {
   async function deletePost(postId) {
    try {
        const response = await fetch(`http://localhost:4000/delete/${postId}`, {
            method: 'DELETE',
            credentials: 'include' // This includes cookies in the request
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Post deleted successfully:', result);
            redirect(true)
            // Handle successful deletion (e.g., update UI, show message)
        } else {
            const errorData = await response.json();
            console.error('Error deleting post:', errorData);
            // Handle errors (e.g., show error message)
        }
    } catch (error) {
        console.error('Network error:', error);
        // Handle network errors (e.g., show error message)
    }
}
  const [redirect,setRedirect]=useState(false)
  const { userInfo } = useContext(UserContext);
  const [blogInfo, setBlogInfo] = useState(null);
  const { id } = useParams();
  useEffect(() => {
    const fetchSinglePost = async () => {
      const res = await fetch(`http://localhost:4000/post/${id}`);
      const info = await res.json();
      setBlogInfo(info);
      console.log(info);
  

    };
    fetchSinglePost();
    }, []);
      if(redirect){
        <Navigate to={'/'}/>
      }
  if (!blogInfo) return "";
  return (
    <div className="single-blog-page">
      <div className={styles.imageContainer}>
        <img src={`http://localhost:4000/${blogInfo.cover}`} alt="" />
      </div>

      {blogInfo.id === userInfo._id && (
        <Link to={`/edit/${blogInfo._id}`} className="edit-container">
          <svg
            data-slot="icon"
            fill="none"
            stroke-width="1.5"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            ></path>
          </svg>{" "}
          <div className="edit-btn">Edit</div>{" "}
        </Link>
      )}

      <button className="delete-btn" onClick={()=>deletePost(id)}> Delete Post</button>

      <h2>
        {blogInfo.title} - {blogInfo.summary}
      </h2>
      <div className="single-post-time">
        {format(new Date(blogInfo.createdAt), "do MMM yyyy")} &middot;
        {format(new Date(blogInfo.createdAt), " hh:mm")}
      </div>

      <div className="authorContainer">
        <svg
          className={styles.author}
          data-slot="icon"
          fill=""
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          ></path>
        </svg>
        <span className="author">{blogInfo.author.username}</span>
      </div>
      <p dangerouslySetInnerHTML={{ __html: blogInfo.content }}></p>
    </div>
  );
};

export default SinglePost;
