import { db } from "./config/firebase";
import {getDocs, collection, where, query} from "firebase/firestore";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AddLinks from "./AddLinks";
const AdminLinks = () => {

    const {task_id} = useParams();
    const [links, setLinks] = useState([]);
    const navigate = useNavigate();
    
    const [isOpen, setIsOpen] = useState(false);
    const [changes, setChanges] = useState(0);

    useEffect(() => {
        try {
            const linksRef = query(collection(db, "links"), where("task_id", "==", `${task_id}`));
            const getLinks = async () => {
                const data = await getDocs(linksRef);
                setLinks(data.docs.map(doc => (
                    {
                        ...doc.data(),
                        id: doc.id
                    }
                )));
            }

            getLinks();
            
        } catch (error) {
            console.log(error.message);
        }
    }, [task_id, changes]);

    return (
        <div className="links">
            <div className="button-link">
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>Back</button>
                <button className="btn btn-primary" onClick={() => setIsOpen(true)}>Add Link</button>
            </div>
            {links.map(url => (
                <a target="_blank" href={url.url} key={url.id} rel="noreferrer">
                    <h1><i class="fas fa-thumbtack"></i> {url.description}</h1>
                </a>
            ))}
            <div className="mt-3">
                <AddLinks isOpen={isOpen} setIsOpen={setIsOpen} setChanges={setChanges} />
            </div>
        </div> 
     );
}
 
export default AdminLinks;