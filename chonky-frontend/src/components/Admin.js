import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Modal,
  TextField,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [newLimit, setNewLimit] = useState("");

  // Update the users list using useEffect and axios
  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:8000/get_users");
        setUsers(res.data.users);
        console.log(res.data.users);
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    };
    getUsers();
  }, []);

  const handleStorageLimitChange = (userId, newLimit) => {
    // Implement the logic to change the storage limit for the user
    //Post request to change the storage limit, if successful, update the users list

    axios
      .post("http://localhost:8000/update_storage_limit", {
        user_id: userId,
        storage_limit: newLimit,
      })
      .then((res) => {
        console.log(res);
        console.log(res.data);
        if (res.data.status === 1) {
          const newUsers = users.map((user) => {
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

  const handleDeleteUser = (userId) => {
    // Implement the logic to delete the user
    console.log(`Deleting user ${userId}`);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      padding="20px"
      margin="20px"
    >
      <TableContainer component={Paper} style={{ width: "60%" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Bucket Name</TableCell>
              <TableCell>Storage Used</TableCell>
              <TableCell>Storage Limit</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.user_id}>
                <TableCell>{user.user_id}</TableCell>
                <TableCell>{user.bucket_name}</TableCell>
                <TableCell>{user.storage_used}</TableCell>
                <TableCell>{user.storage_limit}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() =>
                      handleOpenModal(user.user_id, user.storage_limit)
                    }
                    aria-label="Change Limit"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteUser(user.user_id)}
                    aria-label="Delete User"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
