import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "@firebase/firestore";
import { db } from "./config/firebase";
const Video = () => {

    const {task_id} = useParams();
    const [video, setVideo] = useState({})

    useEffect(() => {
        const taskRef = doc(db, "tasks", task_id)
        const getTask = async () => {
            const vidUrl = await getDoc(taskRef);
            if (vidUrl.data()) {
                setVideo({
                    videoUrl: vidUrl.data().video
                });
            }
        }
        getTask();
    }, [task_id]);

    return ( 
        <div className="video mt-3">
            {video && 
                <iframe 
                    width="560" 
                    height="315" 
                    src={`${video.videoUrl}`}
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen>
                </iframe>
            }

            <div className="video-desc">
                <p>This video is disscuss about how to set up git in locan environment and set up SSH to create connection betwen local directory and gitlab directory</p>
            </div>
        </div>
        
     );
}
 
export default Video;