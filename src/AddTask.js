import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, addDoc } from "@firebase/firestore";
import { db, storage } from "./config/firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "@firebase/storage";

const AddTask = () => {

    const {chapter_id} = useParams();

    const [keyword, setKeyword] = useState("");
    const [name, setName] = useState("");

    const navigate = useNavigate();

    const [overallProgress, setOverallProgres] = useState(0);

    const taskRef = query(collection(db, "tasks"), where("chapter", "==", `${chapter_id}`));

    useEffect(() => {
        const getData = () => {
            getDocs(taskRef)
            .then(data => {
                setName(`Task 0${data.docs.length + 1}`);
            });
        }

        getData()
    }, [taskRef]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const thumbnailFile = e.target[2].files[0];
        const documentFile = e.target[3].files[0];
        const videoFile = e.target[4].files[0];

        uploadFile(thumbnailFile, documentFile, videoFile);
    }

    const uploadFile = (thumbnailFile, documentFile, videoFile) => {
        if (!thumbnailFile || !documentFile || !videoFile) {
            throw new Error("file undefine");
        }

        const uploadThumbnailProcess = uploadBytesResumable(ref(storage, `thumbnail/${thumbnailFile.name}`), thumbnailFile);

        uploadThumbnailProcess.on("state_changed", (snapshotThumbnail) => {
            const currentThumbnailProgres = Math.round((snapshotThumbnail.bytesTransferred / snapshotThumbnail.totalBytes) * 333);
            setOverallProgres(currentThumbnailProgres);
        }, (err) => {console.log(err)}, 
        () => {
            getDownloadURL(uploadThumbnailProcess.snapshot.ref)
            .then(thumbnailUrl => {
                uploadDocument(documentFile, videoFile, thumbnailUrl);
            })
        })
    }

    const uploadDocument = (documentFile, videoFile, thumbnailUrl) => {
        let docSize = 0;
        const uploadDocumentProcess = uploadBytesResumable(ref(storage, `documents/${documentFile.name}`), documentFile);
        
        uploadDocumentProcess.on("state_changed", (snapshotDoc) => {
            const currentDocProgres = Math.round((snapshotDoc.bytesTransferred / snapshotDoc.totalBytes) * 333);
            docSize = snapshotDoc.totalBytes;
            setOverallProgres(current => current + currentDocProgres);
        }, (err) => {console.log(err)}, 
        () => {
            getDownloadURL(uploadDocumentProcess.snapshot.ref)
            .then(docUrl => {
                uploadVideo(videoFile, thumbnailUrl, docUrl, docSize);
            })
        })
    }

    const uploadVideo = (videoFile, thumbnailUrl, docUrl, docSize) => {
        let videoSize = 0
        const uploadVideoProcess = uploadBytesResumable(ref(storage, `videos/${videoFile.name}`), videoFile);

        uploadVideoProcess.on("state_changed", (snapshotVideo) => {
            const currentVideoProgres = Math.round((snapshotVideo.bytesTransferred / snapshotVideo.totalBytes) * 333);
            videoSize = snapshotVideo.totalBytes;
            setOverallProgres(current => current + currentVideoProgres);
        }, (err) => {console.log(err)}, 
        () => {
            getDownloadURL(uploadVideoProcess.snapshot.ref)
            .then(videoUrl => {

                uploadTask(thumbnailUrl, docUrl, videoUrl, docSize, videoSize);
                })
        })
    }

    const uploadTask = async (thumbnailUrl, docUrl, videoUrl, docSize, videoSize) => {
        const taskRef = collection(db, "tasks");
        const date = new Date();
        const fullDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
        const fileSize = Math.round((docSize + videoSize) / 1000000);
        await addDoc(taskRef, 
            {
                chapter: chapter_id,
                keyword: keyword,
                name: name,
                thumbnail: thumbnailUrl,
                document: docUrl,
                video: videoUrl,
                date: fullDate,
                fileSize
            });
            navigate('/admin');
            
        }

    return ( 
        <>
        <form onSubmit={handleSubmit}>
            <div className="add-task-form">
                <div className="mb-3">       
                    <label className="form-label">Task Name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} type="text" className="form-control" />
                    <label className="form-label">Keyword</label>
                    <input placeholder="Keyword" onChange={(e) => setKeyword(e.target.value)}  type="text" className="form-control" />
                </div>
                <div>
                    <label className="form-label">Thumbnail</label>
                    <input type="file" className="form-control" />
                    <label className="form-label">Document</label>
                    <input type="file" className="form-control" />
                    <label className="form-label">Video</label>
                    <input type="file" className="form-control" />
                </div>
                </div>
            <button type="submit" className="btn btn-primary mt-5 me-5">Submit</button>
        </form>
        <br />
        {overallProgress && <h5>{overallProgress}</h5>} kb
        </>
     );
}
 
export default AddTask;