import { db } from "./config/firebase";
import {getDocs, collection, where, query} from "firebase/firestore";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
const Links = () => {

    const {task_id} = useParams();
    const [links, setLinks] = useState([]);
    const navigate = useNavigate();

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
    }, [task_id]);

    return (
        <div className="links">
            <button className="btn btn-sm btn-secondary" onClick={() => navigate(-1)}>Back</button>
            {links.map(url => (
                <a target="_blank" href={url.url} key={url.id} rel="noreferrer">
                    <h1><i class="fas fa-thumbtack"></i> {url.description}</h1>
                </a>
            ))}
        </div> 
     );
}
 
export default Links;