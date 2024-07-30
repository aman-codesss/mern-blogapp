import { Route, Routes } from "react-router-dom";
import "./App.css";


import PostsAll from "./components/PostsAll";
import Login from "./components/Login";
import Register from "./components/Register";
import Layout from "./components/Layout";
import UserContextProvider from "./context/UserContext";
import CreatePost from "./components/CreatePost";
import SinglePost from "./components/SinglePost";
import EditPost from "./components/EditPost";


function App() {
  return (
    <>
    <UserContextProvider>

      <main>
    <Routes>

      <Route path="/" element={<Layout/>}>
        <Route index element={ <PostsAll/>}/>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/create" element={<CreatePost/>} />
        <Route path={'/post/:id'} element={<SinglePost/>} />
        <Route path={'/edit/:id'} element={<EditPost/>} />
        
      </Route>
    </Routes>
      </main>
    </UserContextProvider>
  
    </>
  );
}

export default App;
