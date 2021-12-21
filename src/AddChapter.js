import { useEffect, useState } from "react";
import { db } from "./config/firebase";
import { collection, addDoc, getDocs } from "@firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./App.css";

const AddChapter = () => {

    const [chapterNumber, setChapterNumber] = useState(0);
    const [keyword, setKeyword] = useState("");
    const navigate = useNavigate();
    
    const handleSubmit = (e) => {
        const chapterRef = collection(db, "chapters");
        e.preventDefault();

        addDoc(chapterRef, {
            chapter: chapterNumber,
            keyword
        }).then (() => {
            setChapterNumber(0);
            setKeyword("");
            navigate('/admin');
        })
    }

    useEffect(() => {
        const chapterRef = collection(db, "chapters");
        const getData = async () => {
            const data = await getDocs(chapterRef).then(chapter => {
                return chapter.docs.length
            })
            return data;
        }

        getData().then(total => {
            setChapterNumber(total+1);
        })
    }, []);

    return ( 
        <div className="add-form">
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Chapter Number</label>
                    <input value={chapterNumber} type="number" onChange={(e) => setChapterNumber(e.target.value)} className="form-control" />
                    <label className="form-label">Tags</label>
                    <input value={keyword} type="text" onChange={(e) => setKeyword(e.target.value)} className="form-control" />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
     );
}
 
export default AddChapter;

