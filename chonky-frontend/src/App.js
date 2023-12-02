import { MyFileBrowser } from "./components/FileBrowser";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Login from "./components/Login";
import React, { useState } from "react";
import { Box } from "@mui/material";
import SideBar from "./components/SideBar";
import MetaDataPane from "./components/MetaData";
import useToken from "./components/useToken";
import ProtectedRoute from "./utils/ProtectedRoute";
function App() {
  const [collapsed, setCollapsed] = React.useState(false);
  const [tab, setTab] = React.useState("myfiles");
  const [rootFolderId, setRootFolderId] = React.useState("");
  const [currentFolderId, setCurrentFolderId] = useState(rootFolderId);
  const [metaFileData, setMetaFileData] = useState({});
  const [showMetaData, setShowMetaData] = useState(false);
  const { token, removeToken, setToken } = useToken();
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Box>
                  <Box sx={{ display: "flex", flexGrow: 1 }}>
                    <Box>
                      <SideBar
                        setRootFolderId={setCurrentFolderId}
                        collapsed={collapsed}
                        setCollapsed={setCollapsed}
                        setTab={setTab}
                      />
                    </Box>
                    <Box
                      sx={{ flexGrow: 1 }}
                      onClick={() => {
                        setShowMetaData(false);
                      }}
                    >
                      <MyFileBrowser
                        currentFolderId={currentFolderId}
                        setCurrentFolderId={setCurrentFolderId}
                        sharedType={tab}
                        rootFolderId={rootFolderId}
                        setRootFolderId={setRootFolderId}
                        setMetaFileData={setMetaFileData}
                        setShowMetaData={setShowMetaData}
                      />
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
              </ProtectedRoute>
            }
          ></Route>
          <Route path="/login" element={<Login setToken={setToken} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
