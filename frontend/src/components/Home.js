import React from 'react';
// import "./App.css";
import Sidebar from "./Sidebar";
import Data from "./Data";
import { useEffect, useState } from "react";
import axios from 'axios';

const HomePage = () => {

    const [objects, setObjects] = useState([]);

    useEffect(() => {
        const fetchObjects = async () => {
            const res = await axios.post("http://localhost:5000/list_objects", {
                    bucket_name: "bkt1"
            });
            setObjects(res.data.objects);
            console.log(res.data.objects);
        }
        fetchObjects();
    }
    , []);

    return (
        <div className="Homepage">
             {/* <Sidebar/> */}
             <Data objects={objects}/>
        </div>
    )
}

export default HomePage