import { MyFileBrowser } from "./components/FileBrowser";
import React, { useState } from "react";
import { Box } from "@mui/material";
import SideBar from "./components/SideBar";
import MetaDataPane from "./components/MetaData";
function App() {
  const [collapsed, setCollapsed] = React.useState(false);
  const [tab, setTab] = React.useState("myfiles");
  const [metaFileData, setMetaFileData] = useState({});
  const [showMetaData, setShowMetaData] = useState(false);
  return (
    <Box>
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        <Box>
          <SideBar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            setTab={setTab}
          />
        </Box>
        <Box
          sx={{ flexGrow: 1 }}
          onClick={() => {
            setShowMetaData(false);
            console.log("clicked");
          }}
        >
          {tab === "myfiles" ? (
            <MyFileBrowser
              setMetaFileData={setMetaFileData}
              setShowMetaData={setShowMetaData}
            />
          ) : (
            <div>Shared Files</div>
          )}
        </Box>

        <Box>
          <MetaDataPane
            showMetaData={showMetaData}
            setShowMetaData={setShowMetaData}
            metaFileData={metaFileData}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default App;
