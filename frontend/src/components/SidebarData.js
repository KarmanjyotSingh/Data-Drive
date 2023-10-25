import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

export const SidebarData = [
     {
        title: "Home",
        icon: <HomeIcon/>,
        link:"/home"
    },
    {
        title: "Files",
        icon: <InsertDriveFileIcon/>,
        link: "/files"
    }
]

//export default SidebarData