import { AppBar, Tabs, Tab, Box } from "@mui/material";
import { MyFileBrowser } from "./components/FileBrowser";
import React from "react";
function App() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="primary"
          variant="fullWidth"
          sx={{
            ".MuiTabs-flexContainer": {
              justifyContent: "flex-start",
            },
            ".MuiTab-root": {
              fontSize: "0.875rem",
            },
            ".MuiTabs-indicator": {
              backgroundColor: "black",
            },
          }}
        >
          <Tab label="My Files" />
          <Tab label="Shared Files" />
        </Tabs>
      </AppBar>
      {value === 0 && <MyFileBrowser />}
      {/* value === 1 && <SharedFiles /> */}
    </Box>
  );
}

export default App;
