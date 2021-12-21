import { db } from "./config/firebase";
import {getDocs, collection, query, where} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SideBar = ({user, signInWithGoogle, handleLogout, setIsOpen}) => {

    const [list, setList] = useState([]);

    useEffect(() => {
        const starRef = query(collection(db, "star"), where("uid", "==", `${user?.uid}`));
        const getStar = async () => {
            const data = await getDocs(starRef);
            setList(data.docs.map(doc => (
                {
                    id: doc.id,
                    ...doc.data()
                }
            )));
        }
        getStar();
    }, [user])
    
    return (
        <>
           
            {user && 
                <>
                    <div className="dropdown">
                        <div className="side-icon" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="fas fa-ellipsis-v"></i>
                        </div>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                            <li><div className="dropdown-item" onClick={() => setIsOpen(true)}>Absent</div></li>
                        </ul>
                    </div>
                    <img className="mt-3 mb-3" src={`${user.photoURL}`} alt="profile-pic" referrerPolicy="no-referrer" />
                </>
            }
            {list.map((task, id) => (
                <div className="side-task" key={id}>
                    <Link to={`/task/${task.id}`}>
                         <h5><i className="fas fa-check-circle"></i> {task.task_keyword}</h5>
                    </Link>
                </div>
            ))}
            <br />
            {user ? <button className="btn btn-outline btn-secondary" onClick={handleLogout}>Logout</button>  : <button className="btn btn-outline btn-primary" onClick={signInWithGoogle}>Login</button>}
            
            
        </>
    );
}
 
export default SideBar;