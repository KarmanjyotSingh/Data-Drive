import React, { useState, useEffect } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Box } from "@mui/material";
import { CircularProgressbar } from "react-circular-progressbar"; // admin control center for the web browser
import HomeIcon from "@mui/icons-material/Home";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import { Grid } from "@mui/material";
import axios from "axios";
import { Card, CardContent, Typography } from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Modal,
  Paper,
  IconButton,
} from "@mui/material";
import { TextField, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Edit } from "@mui/icons-material";
import { TablePagination } from "@mui/material";

export default function AdminDashboard({ collapsed, setCollapsed }) {
  const [currentBucket, setCurrentBucket] = useState("bucket1");
  const [defaultStorageLimit, setDefaultStorageLimit] = useState(50);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentBucketSize, setCurrentBucketSize] = useState(50);
  const [rows, setUsers] = useState([]);
  const [page, setPage] = React.useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [newLimit, setNewLimit] = useState("");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/get_users");
        setUsers(res.data.users);
        console.log(res.data.users);
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    };
    getUsers();
  }, []);

  function handleBucketChange(newBucketName) {}
  function handleUpdateBucket() {}
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = (userId, oldLimit) => {
    setSelectedUserId(userId);
    setNewLimit(oldLimit);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleConfirmModal = () => {
    handleStorageLimitChange(selectedUserId, newLimit);
    setOpenModal(false);
  };

  const handleDelete = (userId) => {
    // Implement the logic to delete the user
    console.log(`Deleting user ${userId}`);
  };

  const handleStorageLimitChange = (userId, newLimit) => {
    axios
      .post("http://localhost:5000/update_storage_limit", {
        user_id: userId,
        storage_limit: newLimit,
      })
      .then((res) => {
        console.log(res);
        console.log(res.data);
        if (res.data.status === 1) {
          const newUsers = rows.map((user) => {
            if (user.user_id === userId) {
              return {
                ...user,
                storage_limit: newLimit,
              };
            }
            return user;
          });
          setUsers(newUsers);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Box sx={{ display: "flex", flexGrow: 1, maxWidth: "xs" }}>
      <Box>
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        >
          <Menu iconShape="circle">
            {collapsed ? (
              <MenuItem
                icon={<KeyboardDoubleArrowRightIcon />}
                onClick={() => setCollapsed(!collapsed)}
              ></MenuItem>
            ) : (
              <MenuItem
                suffix={<KeyboardDoubleArrowLeftIcon />}
                onClick={() => setCollapsed(!collapsed)}
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
                  Data Drive
                </div>
              </MenuItem>
            )}
            <MenuItem icon={<HomeIcon />}> Dashboard </MenuItem>
          </Menu>
        </Sidebar>
      </Box>
      <Box sx={{ width: "100%" }}>
        <Grid sx={{ margin: 2 }} container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: 300, width: 300 }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {currentBucket}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  {currentBucketSize}% Full
                </Typography>
                <div style={{ width: 200, height: 200 }}>
                  <CircularProgressbar
                    value={currentBucketSize}
                    text={`${currentBucketSize}%`}
                    styles={{
                      path: {
                        stroke: `rgba(62, 152, 199, ${100 / 100})`,
                        strokeLinecap: "butt",
                        transition: "stroke-dashoffset 0.5s ease 0s",
                        transform: "rotate(0.25turn)",
                        transformOrigin: "center center",
                      },
                      trail: {
                        stroke: "#d6d6d6",
                        strokeLinecap: "butt",
                        transform: "rotate(-135deg)",
                        transformOrigin: "center center",
                      },
                      text: {
                        fill: "#3E98C7",
                        fontSize: "16px",
                      },
                      background: {
                        fill: "#3e98c7",
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: 300, width: 300 }}>
              <CardContent>
                <Typography variant="h5" component="div">
                  Total Users
                </Typography>
                <Typography variant="h2">100</Typography>
              </CardContent>{" "}
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: 300, width: 300 }}>
              <CardContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Typography variant="h5" component="div">
                    Current Bucket
                  </Typography>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    value={currentBucket}
                    onChange={handleBucketChange}
                  />
                  <Button variant="contained" onClick={handleUpdateBucket}>
                    Update Bucket
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: 300, width: 300 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  padding: 2,
                }}
              >
                <Typography variant="h5" component="div">
                  Default Storage Limit
                </Typography>
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                  value={defaultStorageLimit}
                  onChange={handleBucketChange}
                />
                <Button variant="contained" onClick={handleUpdateBucket}>
                  Update Storage Limit
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
        <TableContainer
          component={Paper}
          sx={{ maxWidth: "95%", overflowX: "auto", margin: 2 }}
        >
          <Table sx={{ minWidth: 100 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>User ID</TableCell>
                <TableCell align="right">Bucket Name</TableCell>
                <TableCell align="right">Storage Used</TableCell>
                <TableCell align="right">Storage Limit</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow key={row.user_id}>
                    <TableCell
                      style={{ width: 100 }}
                      component="th"
                      scope="row"
                    >
                      {row.user_id}
                    </TableCell>
                    <TableCell align="right">{row.bucket_name}</TableCell>
                    <TableCell align="right">{row.storage_used}</TableCell>
                    <TableCell align="right">{row.storage_limit}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleDelete(row.user_id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={() =>
                          handleOpenModal(row.user_id, row.storage_limit)
                        }
                        aria-label="Change Limit"
                      >
                        <Edit />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Box>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            width="300px"
            padding="20px"
            backgroundColor="#fff"
            borderRadius="4px"
          >
            <TextField
              label="New Storage Limit"
              value={newLimit}
              onChange={(e) => setNewLimit(e.target.value)}
              margin="normal"
              variant="outlined"
            />
            <Button variant="contained" onClick={handleConfirmModal}>
              OK
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
