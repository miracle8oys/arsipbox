import { query, collection, getDocs, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "./config/firebase";
const Absent = () => {

    const [student, setStudent] = useState([]);
    const [dateKey, setDateKey] = useState('');
    const [day, setDay] = useState(0);
    const [mounth, setMounth] = useState(0);
    const [year, setYear] = useState(0);
    


    useEffect(() => {
        try {
            let absentRef = null
            if (dateKey) {
                absentRef = query(collection(db, "absent"), where("date", "==", `${dateKey}`));
                console.log(dateKey);
            } else {
                absentRef = query(collection(db, "absent"));
            }
            const getStudent = async () => {
                const data = await getDocs(absentRef);
                setStudent(data.docs.map(doc => (
                    {
                        ...doc.data(),
                        id: doc.id
                    }
                )));
            }

            getStudent();
            
        } catch (error) {
            console.log(error.message);
        }
    }, [dateKey]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setDateKey(`${year}-${mounth}-${day}`)
    }
 
    return ( 
        <div className="absent">
            <form onSubmit={handleSubmit}>
                <input placeholder="Day" type="number" onChange={(e) => setDay(e.target.value)} />
                <input placeholder="Mounth" type="number" onChange={(e) => setMounth(e.target.value)} />
                <input placeholder="Year" type="number" onChange={(e) => setYear(e.target.value)} />
                <button className="btn btn-primary" type="submit">Submit</button>
            </form>
            <table class="table">
            <thead>
                <tr>
                <th scope="col">Nim</th>
                <th scope="col">Name</th>
                <th scope="col">Date</th>
                </tr>
            </thead>
            <tbody>
            {student.map(std => (
                <tr key={std.id}>
                    <th scope="row">{std.nim}</th>
                    <th>{std.name}</th>
                    <td>{std.date}</td>
                </tr>
            ))}
             </tbody>
            </table>
        </div>
     );
}
 
export default Absent;