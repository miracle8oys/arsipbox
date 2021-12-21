import { db } from "./config/firebase";
import {getDocs, collection, query, orderBy} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Admin = () => {
    const [chapters, setChapters] = useState([]);

    useEffect(() => {
        try {
            const chapterRef = query(collection(db, "chapters"), orderBy("chapter"));
            const getChapter = async () => {
                const data = await getDocs(chapterRef);
                setChapters(data.docs.map(doc => (
                    {
                        ...doc.data(),
                        id: doc.id
                    }
                )));
            }

            getChapter();
            
        } catch (error) {
            console.log(error.message);
        }
    }, []);

    return ( 
        <div className="home-admin container">
            <Link to="/admin/add-chapter">
             <button className="btn btn-primary">Add New Chapter</button>
            </Link>
            <div className=" mt-5">
                    <table class="table">
                        <thead>
                            <tr>
                            <th scope="col">No</th>
                            <th scope="col">Title</th>
                            </tr>
                        </thead>
                        <tbody>
                {chapters.map(ch => (
                            <tr  key={ch.id}>
                                <th scope="row">
                                    <Link className="chapter-admin" to={`/admin/${ch.chapter}`}>
                                        <h5 className="card-text">Chapter: {ch.chapter}</h5>
                                    </Link>
                                </th>
                                <th>
                                    <Link className="chapter-admin" to={`/admin/${ch.chapter}`}>
                                            <p className="card-text">{ch.keyword}.</p>
                                    </Link>
                                </th>
                            </tr>
                ))}
                </tbody>
                </table>
                    
            </div>

        </div>
     );
}
 
export default Admin;