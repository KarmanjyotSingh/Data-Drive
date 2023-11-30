                   import { Box, Typography } from "@mui/material";
import React from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import CloseIcon from "@mui/icons-material/Close";
import { extractFiletypeIcon } from "../utils/extract-file-type";
export default function MetaDataPane({
  showMetaData,
  setShowMetaData,
  metaFileData,
}) {
  console.log(metaFileData.metadata);
  return (
    <>
      {metaFileData.metadata && showMetaData && (
        <Sidebar
          collapsed={!showMetaData}
          onToggle={() => setShowMetaData(!showMetaData)}
          width="400px"
        >
          <Menu iconShape="circle">
            <MenuItem
              suffix={<CloseIcon />}
              onClick={() => setShowMetaData(!showMetaData)}
              icon = {extractFiletypeIcon(metaFileData.name)}
            >
              <div
                style={{
                  padding: "9px",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  fontSize: 15,
                  letterSpacing: "1px",
                }}
                
              >
                {metaFileData.name}
              </div>
            </MenuItem>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                File details
              </Typography>
              <Box>
                <Typography variant="body1" gutterBottom>
                  Name:
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {metaFileData.name}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body1" gutterBottom>
                  Modified Date:
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {metaFileData.modDate}
                </Typography>
              </Box>
              <Typography variant="body1" gutterBottom>
                Metadata:
              </Typography>
              <Box sx={{ paddingLeft: 2 }}>
                {Object.entries(metaFileData.metadata).map(([key, value]) => (
                  <Box key={key}>
                    <Typography variant="body1">{key}:</Typography>
                    <Typography variant="body2">{value}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Menu>
        </Sidebar>
      )}
    </>
  );
}
