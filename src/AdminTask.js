import { db } from "./config/firebase";
import {getDocs, collection, where, query, orderBy} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import './App.css';

const AdminTask = () => {
    const [tasks, setTasks] = useState([]);
    const {chapter_id} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const tasksRef = query(collection(db, "tasks"), where("chapter", "==", `${chapter_id}`), orderBy("name"));
            const getTasks = async () => {
                const data = await getDocs(tasksRef);
                setTasks(data.docs.map(doc => (
                    {
                        ...doc.data(),
                        id: doc.id
                    }
                )));
            }

            getTasks();
            
        } catch (error) {
            console.log(error.message);
        }
    }, [chapter_id]);

    return ( 
        <div className="home container">
            <div className="row mb-3">
                <div className="col">
                    <button className="btn btn-secondary" onClick={() => navigate(-1)}>Back</button>
                </div>
                <div className="col">
                    <Link to={`/admin/add-task/${chapter_id}`}>
                        <button className="btn btn-primary">Add Task</button>
                    </Link>
                </div>
            </div>
            <div className="row">
                {tasks.map(task => (
                    <div key={task.id} className="col">
                            <Link className="chapter" to={`/admin/task/${task.id}`}>
                                <div className="card">
                                    <h5>{task.name}</h5>
                                    <img src={task.thumbnail} className="card-img-top" alt="thumbnail" />
                                    <div className="card-body-admin">
                                        <p className="card-text">{task.keyword}</p>
                                    </div>
                                </div>
                            </Link>
                    </div>
                ))}
                    
            </div>
        </div>
     );
}
 
export default AdminTask;