import { Link, useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "@firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./config/firebase";
import './App.css';
const AdminTaskContents = () => {
    const {task_id} = useParams();
    const navigate = useNavigate();

    const [document, setDocument] = useState({});

    useEffect(() => {
        const taskRef = doc(db, "tasks", task_id)
        const getTask = async () => {
            const docUrl = await getDoc(taskRef);
            
            if (docUrl.data()) {
                setDocument({
                    documentUrl: docUrl.data().document
                });
            }
        }
        getTask();
    }, [task_id]);

    return ( 
        <div className="task-contents container">

            <div className="row mb-2 menu menu-vid">
                <Link to={`/video/${task_id}`}>
                    <h1 className="text-dark"><i class="fas fa-video"></i> Recording Video</h1>
                </Link>
            </div>
            <div className="row mb-2 menu menu-doc">
                <a href={`${document.documentUrl}`} target="_blank" rel="noreferrer">
                    <h1 className="text-dark"><i class="far fa-file-pdf"></i> Reading Material</h1>
                </a>
            </div>
            <div className="row mb-2 menu menu-links">
                <Link to={`/admin/link/${task_id}`}>
                    <h1 className="text-dark"><i class="fas fa-paperclip"></i> Link</h1>
                </Link>
            </div>
            
            <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>Back</button>
        </div>
     );
}
 
export default AdminTaskContents;