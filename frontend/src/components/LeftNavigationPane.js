import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import RecyclingIcon from '@mui/icons-material/Recycling';
import HomeIcon from '@mui/icons-material/Home';
import FolderIcon from '@mui/icons-material/Folder';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import StarBorderIcon from '@mui/icons-material/StarBorder';

const leftNavigationPane = (
    <React.Fragment>
        <ListItemButton>
            <ListItemIcon>
                <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
        </ListItemButton>
        <ListItemButton>
            <ListItemIcon>
                <FolderIcon />
            </ListItemIcon>
            <ListItemText primary="My Files" />
        </ListItemButton>
        <ListItemButton>
            <ListItemIcon>
                <FolderSharedIcon />
            </ListItemIcon>
            <ListItemText primary="Shared" />
        </ListItemButton>
        <ListItemButton>
            <ListItemIcon>
                <StarBorderIcon />
            </ListItemIcon>
            <ListItemText primary="Favorites" />
        </ListItemButton>
        <ListItemButton>
            <ListItemIcon>
                <RecyclingIcon />
            </ListItemIcon>
            <ListItemText primary="Recycle Bin" />
        </ListItemButton>
    </React.Fragment>
);

export default leftNavigationPane;