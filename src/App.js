import './App.css';
import Home from './Home';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Task from './Task';
import TaskContents from './TaskContents';
import Links from './Links';
import Video from './Video';
import AddChapter from './AddChapter';
import Admin from './Admin';
import AdminTask from './AdminTask';
import AddTask from './AddTask';
import AdminTaskContents from './AdminTaskContent';
import AdminLinks from './AdminLinks';
import Absent from './Absent';
import Search from './Search';
import { onAuthStateChanged } from "firebase/auth";
import { auth, signInWithGoogle } from "./config/firebase";
import { useState } from 'react';

function App() {
  const [user, setUser] = useState({});

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
});
  return (
    <div className="App mt-5">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home auth={auth} signInWithGoogle={signInWithGoogle} user={user} />} />
        <Route path="/chapter/:chapter_id" element={<Task user={user} />} />
        <Route path="/search" element={<Search user={user} />} />
        <Route path="/task/:task_id" element={<TaskContents />} />
        <Route path="/link/:task_id" element={<Links />} />
        <Route path="/Video/:task_id" element={<Video />} />

        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/:chapter_id" element={<AdminTask />} />
        <Route path="/admin/task/:task_id" element={<AdminTaskContents />} />
        <Route path="admin/link/:task_id" element={<AdminLinks />} />
        <Route path="admin/absent" element={<Absent />} />
        <Route path="/admin/add-task/:chapter_id" element={<AddTask />} />
        <Route path="/admin/add-chapter" element={<AddChapter />} />

      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
