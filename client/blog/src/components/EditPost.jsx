import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'
import { Navigate, useParams } from 'react-router-dom';

const  modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  }
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ]

const EditPost = () => {
    const [title,setTitle]=useState('')
    const [summary,setSummary]=useState('')
    const [content,setContent]=useState('')
    const [files,setFiles]=useState('')
    const [redirect,setRedirect]=useState(false)
    const {id}=useParams()

    useEffect(()=>{
        const updatePost = async()=>{
            const res = await fetch(`http://localhost:4000/post/${id}`)
            const info =await res.json()
            // console.log(info)
            setTitle(info.title)
            setSummary(info.summary)
            setContent(info.content)
            
           
        }
        updatePost()
    },[])
    const handleUpdatePost = async(e)=>{
        e.preventDefault()
        const data = new FormData()
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('id', id);
        if(files?.[0]){

            data.set('file', files?.[0]);
            }

        const res = await fetch(`http://localhost:4000/post`,{method:'PUT',body:data,credentials:'include'})
        const response =await res.json()
        console.log(response)
        if(res.ok) setRedirect(true)
    }   

    if(redirect){
        return <Navigate to={`/post/${id}`}/>
    }
  return ( 
    <div >
        <h4>Edit your post</h4>
      <form action="" onSubmit={handleUpdatePost}>
        <input type="text" placeholder='Title' value={title} onChange={e=>setTitle(e.target.value)}/>
        <input type="text" placeholder='Summary'  value={summary} onChange={e=>setSummary(e.target.value)}/>
        <input type="file" onChange={e=>setFiles(e.target.files)} /> <br />
        <ReactQuill modules={modules} formats={formats} value={content} onChange={newValue =>setContent(newValue)}/>
        <button className='btn'>Update Post</button>
      </form>
    </div>
  )
}

export default EditPost
