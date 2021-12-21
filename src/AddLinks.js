import { useState } from "react";
import { collection, addDoc } from "@firebase/firestore";
import { db } from "./config/firebase";
import { useParams } from "react-router-dom";
// import { useNavigate } from "react-router";

const AddLinks = ({isOpen, setIsOpen, setChanges}) => {

    const {task_id} = useParams();
    const [url, setUrl] = useState("");
    const [desc, setDesc] = useState("");

    const MODAL_STYLES = {
        position: 'fixed',
        width: '50%',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#FFF',
        padding: '50px',
        zIndex: 1000
      }
    
    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const linkRef = collection(db, "links");
        await addDoc(linkRef, {
            task_id,
            url,
            description: desc
        })

        setChanges(current => current + 1);
        setIsOpen(false);
    }

    return ( 
        <div style={MODAL_STYLES} className="container create-link">
            <div className="row close-row">
                    <i onClick={() => setIsOpen(false)} className="far fa-times-circle close-btn"></i>
            </div>
            <div className="row">
                <div className="col m-auto">
                    <h1>Add Link</h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input placeholder="url" onChange={(e) => setUrl(e.target.value)} type="text" className="form-control d-inline" aria-describedby="url" />
                    </div>
                    <div className="mb-3">
                        <input placeholder="description" onChange={(e) => setDesc(e.target.value)} type="text" className="form-control d-inline" aria-describedby="desc" />
                    </div>
                    <div>
                        <button type="submit" className="btn btn-primary d-inline">Submit</button>
                    </div>
                </form>
                <div>
                </div>
            </div>
        </div>
     );
}
 
export default AddLinks;