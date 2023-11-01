import DataTable from "./NewDataTable";
import leftNavigationPane from "./LeftNavigationPane";
import BackgroundLetterAvatars from "../utils/user-icon";

import * as React from "react";
import ls from "local-storage";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Stack,
  SvgIcon,
  Typography,
  Button,
  CssBaseline,
  Box,
  Toolbar,
  List,
  Divider,
  IconButton,
  Container,
  Grid,
  Paper,
  Link,
} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";
import { useRef } from "react";
import ViewListIcon from "@mui/icons-material/ViewList";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import axios from "axios";
import { Modal } from "@mui/material";
import TextField from "@mui/material/TextField";
import ThumbnailView from "./thumbNailView";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link
        color="inherit"
        href="https://github.com/SBiswal02/Data-Drive_Red-flags"
      >
        Website designed by Redflags
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const defaultTheme = createTheme();

const modalBoxStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};
export default function Dashboard() {
  const [open, setOpen] = React.useState(true);
  const [toggleListView, setToggleListView] = React.useState(false);
  const [createFolderModalOpen, setCreateFolderModalOpen] =
    React.useState(false);

  const [currentDirectory, setCurrentDirectory] = React.useState("/");

  const handleFolderModalOpen = () => {
    setCreateFolderModalOpen(true);
  };
  const handleFolderModalClose = () => {
    setCreateFolderModalOpen(false);
  };

  const [displayPath, setDisplayPath] = React.useState([]);

  React.useEffect(() => {
    const path = [ls.get("email"), ...currentDirectory.split("/")];
    setDisplayPath(path);
    console.log(path);
  }, [currentDirectory]);
  const [folderName, setFolderName] = React.useState("");
  const handleFolder = (event) => {
    event.preventDefault();
    setFolderName(event.target.value);
  };

  const handleFolderCreateClick = () => {
    let path = currentDirectory + folderName;
    //remove the first slash
    path = path.substring(1);
    axios
      .post("http://localhost:5000/create_folder", {
        bucket_name: ls.get("email"),
        folder_name: path,
      })
      .then((response) => {
        console.log(response);
        alert("Folder Created");
      })
      .catch((error) => {
        console.log(error);
        alert("Folder Creation Failed");
      });
    setCreateFolderModalOpen(false);
  };

  // false = list view
  // true = grid view

  const toggleView = () => {
    setToggleListView(!toggleListView);
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = (event) => {
    let object = event.target.files[0];
    const form = new FormData();
    form.append("file", object);
    form.append("bucket_name", ls.get("email"));
    form.append("folder_name", currentDirectory.substring(1));
    console.log(form);
    axios
      .post("http://localhost:5000/insert_object",
        form
      )
      .then(function (response) {
        console.log(response.data);
        alert("Upload Successful");
      })
      .catch(function (error) {
        console.log(error);
        alert("Upload Failed");
      });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          style={{ background: "#2E3B55" }}
          position="absolute"
          open={open}
        >
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h5"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Data Foundation System
            </Typography>
            <IconButton color="inherit">
              {BackgroundLetterAvatars(ls.get("email"))}
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">{leftNavigationPane}</List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Stack spacing={3}>
              <Stack direction="row" justifyContent="space-between" spacing={4}>
                <Stack spacing={1}>
                  <Typography variant="h4">
                    {
                      // for each element in display path, create a link
                      displayPath.map((path, index) => {
                        if (path !== "")
                          return (
                            <Link
                              key={index}
                              href="#"
                              onClick={(event) => {
                                event.preventDefault();
                                setCurrentDirectory(
                                  "/" +
                                    displayPath.slice(1, index + 1).join("/")
                                );
                              }}
                            >
                              {path + "/  "}
                            </Link>
                          );
                      })
                    }
                  </Typography>
                </Stack>
                <div style={{marginRight: "20px"}}> 
                  <Stack alignItems="center" direction="row" spacing={1}>
                    <Button color="inherit"
                      sx={{
                        borderRadius: "10px",
                      }}
                    >
                      {toggleListView ? (
                        <ViewCarouselIcon onClick={toggleView} />
                      ) : (
                        <ViewListIcon onClick={toggleView} />
                      )}

                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleFileInputChange}
                      encType="multipart/form-data"
                    />
                    <Button
                      startIcon={
                        <SvgIcon fontSize="small">
                          <ArrowUpOnSquareIcon />
                        </SvgIcon>
                      }
                      sx={{
                        // color white, background same as nabar
                        color: "white",
                        background: "#2E3B55",
                        borderRadius: "10px",
                        "&:hover": {
                          background: "#1b2436",
                        },
                        //dont uppercase
                        textTransform: "none",
                        fontSize: "15px",
                      }}
                      onClick={handleButtonClick}
                    >
                      Upload File
                    </Button>
                    <Button
                      color="inherit"
                      onClick={handleFolderModalOpen}
                      startIcon={
                        <SvgIcon fontSize="small">
                          <CreateNewFolderIcon />
                        </SvgIcon>
                      }
                      sx={{
                        // color white, background same as nabar
                        color: "white",
                        background: "#2E3B55",
                        borderRadius: "10px",
                        "&:hover": {
                          background: "#1b2436",
                        },
                        //dont uppercase
                        textTransform: "none",
                        fontSize: "15px",
                      }}
                    >
                      Create Folder
                    </Button>
                    <Modal
                      open={createFolderModalOpen}
                      onClose={handleFolderModalClose}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <Box sx={modalBoxStyle}>
                        <Typography
                          id="modal-modal-title"
                          variant="h6"
                          component="h2"
                        >
                          Create Folder
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                          <TextField
                            id="outlined-basic"
                            label="Folder Name"
                            variant="outlined"
                            fullWidth
                            onChange={handleFolder}
                          />
                        </Typography>
                        <Button
                          sx={{ mt: 2 }}
                          variant="contained"
                          onClick={handleFolderCreateClick}
                        >
                          Create
                        </Button>
                      </Box>
                    </Modal>
                  </Stack>
                </div>
              </Stack>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper
                    sx={{ p: 2, display: "flex", flexDirection: "column", borderRadius: "20px", marginRight: "30px"}}
                  >
                    {toggleListView ? (
                      <DataTable
                        setCurrentDirectory={setCurrentDirectory}
                        currentDirectory={currentDirectory}
                      />
                    ) : (
                      <ThumbnailView
                        setCurrentDirectory={setCurrentDirectory}
                        currentDirectory={currentDirectory}
                      />
                    )}
                  </Paper>
                </Grid>
              </Grid>
              <Copyright sx={{ pt: 4 }} />
            </Stack>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
