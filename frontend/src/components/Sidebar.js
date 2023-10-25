import React from 'react';
import "./Home.css";
import {SidebarData} from './SidebarData';

const Sidebar = () => {
    return(
        <div className="Sidebar">
            <ul className="SidebarList" >
            {SidebarData.map((val, key) => (
            <li
                key={key}
                className="row"
                onClick={() => {
                window.location.pathname = val.link;
                }}
            >
                <div id="icon">{val.icon}</div>
                <div id="title">{val.title}</div>
            </li>
            ))}
            </ul>
        </div>
        
    );
}

export default Sidebar