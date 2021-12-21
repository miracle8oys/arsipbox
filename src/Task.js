import { db } from "./config/firebase";
import {getDocs, collection, where, query, orderBy, addDoc} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import './App.css';

const Task = ({user}) => {
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


    const handleClick = async (task) => {

        const starRef = collection(db, "star");
        await addDoc(starRef, {
            uid: user.uid,
            task_id: task.id,
            task_keyword: task.keyword
        });
        navigate("/")
    }


    const [list, setList] = useState([]);

    useEffect(() => {
        const starRef = query(collection(db, "star"), where("uid", "==", `${user?.uid}`));
        const getStar = async () => {
            const data = await getDocs(starRef);
            setList(data.docs.map(doc => (
                doc.data().task_id
            )));
        }
        getStar();
    }, [user])

    return ( 
        <div className="home container">
            <div className="row mb-3">
                <div className="col">
                    <button className="btn btn-secondary" onClick={() => navigate(-1)}>Back</button>
                </div>
            </div>
            <div className="row">
                {tasks.map(task => (
                    <div key={task.id} className="col">
                            <div className="chapter" >
                                <div className="card task-card">
                                    <Link to={`/task/${task.id}`}>
                                    <h5 className="task-card-title">{task.name}</h5>
                                    <img src={task.thumbnail} className="card-img-top" alt="thumbnail" />
                                    <div className="card-body">
                                        <p className="card-text">{task.keyword}</p>
                                        
                                    </div>
                                    </Link>
                                    <div className="addsional">
                                        <p className="pt-3">{task.fileSize} Mb</p>
                                        <span onClick={() => handleClick(task)} className={`fa fa-star ${list.includes(task.id) ? `active-star` : ""}`}></span>
                                    </div>
                                    <p className="card-date">{task.date}</p>
                                </div>
                            </div>
                    </div>
                ))}
                    
            </div>
        </div>
     );
}
 
export default Task;