import { db } from "./config/firebase";
import {getDocs, collection, query, orderBy, addDoc} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import "./App.css"
import SideBar from "./SideBar";

const Home = ({auth, signInWithGoogle, user}) => {
    const [chapters, setChapters] = useState([]);
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();

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

    const handleAbsent = async (e) => {
        e.preventDefault();

        const date = new Date();
        const fullDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        const absenRef = collection(db, "absent");

        if (user) {
            await addDoc(absenRef, {
                name: name,
                date: fullDate,
                uid: user.uid,
                nim: nim
            });
            setIsOpen(false);
        }   
    }

    const handleLogout = async () => {
        signOut(auth)
    }

    //searching 
    const handleSearch = (e) => {
        e.preventDefault();
        navigate("/search", {state: {keyword}})
    }


    //absent 

    const [isOpen, setIsOpen] = useState(false);
    const [nim, setNim] = useState(0);
    const [name, setName] = useState('');

    const MODAL_STYLES = {
        position: 'fixed',
        width: '50%',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#fff',
        padding: '50px',
        zIndex: 1000
      }

    return ( 
        <div className="main">
        <div className="sidebar">
            <SideBar user={user} signInWithGoogle={signInWithGoogle} handleLogout={handleLogout} setIsOpen={setIsOpen} />
        </div>
            {isOpen &&
                <div style={MODAL_STYLES} className="container create-link">
                <div className="row close-row">
                        <i onClick={() => setIsOpen(false)} className="far fa-times-circle close-btn"></i>
                </div>
                <div className="row">
                    <div className="col m-auto">
                        <h1>Absent</h1>
                    </div>
                    <form onSubmit={handleAbsent}>
                        <div className="mb-3">
                            <input onChange={(e) => setNim(e.target.value)} placeholder="Nim"  type="number" className="form-control d-inline" aria-describedby="url" />
                        </div>
                        <div className="mb-3">
                            <input onChange={(e) => setName(e.target.value)} placeholder="Nama"  type="text" className="form-control d-inline" aria-describedby="desc" />
                        </div>
                        <div>
                            <button type="submit" className="btn btn-primary d-inline">Submit</button>
                        </div>
                    </form>
                    <div>
                    </div>
                </div>
            </div>
            }
        
            {!isOpen &&
                <div className="home">
                    <div className="row search">
                        <form onSubmit={handleSearch}  className="d-flex search-form mb-3">
                            <input name="keyword" onChange={(e) => setKeyword(e.target.value)} autoComplete="off" className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-outline-success" type="submit">Search</button>
                        </form>
                    </div>
                    <div className="row">
                        {chapters.map(ch => (
                            <div key={ch.id} className="col">
                                    <Link className="chapter" to={`/chapter/${ch.chapter}`}>
                                        <div className="card">
                                            <i className={`far fa-folder-open ${ch.chapter % 2 === 0 ? "orange" : ch.chapter % 3 === 0 ? "grey" : "blue"}`}></i>
                                            <div className="card-body">
                                                <p className="card-text">{ch.keyword}</p>
                                                <hr />
                                                <h5 className="card-title">Chapter: {ch.chapter}</h5>
                                            </div>
                                        </div>
                                    </Link>
                            </div>
                        ))}
                            
                    </div>
                </div>
            }
        
        </div>
     );
}
 
export default Home;