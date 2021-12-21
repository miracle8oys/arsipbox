import { db } from "./config/firebase";
import {getDocs, collection, where, query, addDoc} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import './App.css';
const Search = ({user}) => {

    const {state} = useLocation();
    const {keyword} = state;

    const [currentKey, setCurrentKey] = useState(keyword);

    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const tasksRef = query(collection(db, "tasks"), where("keyword", ">=", currentKey), where("keyword", "<=", currentKey+ 'uf8ff'));
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
    }, [currentKey]);

    const handleSubmitKey = (e) => {
        e.preventDefault();
    }

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
            <div className="row search">
                        <form onSubmit={handleSubmitKey} className="d-flex search-form mb-3">
                            <input onChange={(e) => setCurrentKey(e.target.value)} autoComplete="off" className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-outline-success" type="submit">Search</button>
                        </form>
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
 
export default Search;