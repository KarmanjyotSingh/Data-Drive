import { ChonkyIconName, defineFileAction } from "chonky";
// import { OpenFilesPayload } from 'chonky/lib/types/action-payloads.types';
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { Button } from "@mui/material";
import { InputLabel, Typography, Select, MenuItem } from "@mui/material";
import Modal from "@mui/material/Modal";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
const style = (theme) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  width: "20%",
  display: "flex",
  flexDirection: "column",
  transform: "translate(-50%, -50%)",
  bgcolor: theme.palette.background.paper,
  boxShadow: theme.shadows[24],
  p: theme.spacing(4),
});

export function ShareFilesModal(props) {
  const theme = useTheme();
  const themedStyle = style(theme);
  const [open, setOpen] = useState(props.open);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [permission, setPermission] = useState("");

  useEffect(() => {
    // Fetch the list of users here and update the users state variable
    // This is just a placeholder, replace it with your actual fetch call
    setUsers(["User1", "User2", "User3"]);
  }, []);

  const handleClose = () => {
    setOpen(false);
    props.setOpen(false);
    props.setSharedFile({});
  };

  function handleShare() {
    axios
      .post("http://localhost:5000/add_shared_file", {
        sender_id: "user1",
        receiver_id: selectedUsers,
        file_name: props.sharedFile.id,
        bucket_name: "redflags",
        perms: permission === "read" ? "r" : "w",
      })
      .then(function (response) {
        console.log(response);
        handleClose();
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            width: 400,
            padding: 4,
            margin: "auto",
            ...themedStyle,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Share {`'` + props.sharedFile.name + `'`}
          </Typography>
          <Box sx={{ marginBottom: "20px" }}>
            <InputLabel id="select-permission-label">
              Select Permission
            </InputLabel>
            <RadioGroup
              aria-label="permissions"
              name="permissions"
              sx={{
                marginTop: "10px",
              }}
              value={permission}
              row
              onChange={(event) => setPermission(event.target.value)}
            >
              <FormControlLabel value="read" control={<Radio />} label="Read" />
              <FormControlLabel
                value="write"
                control={<Radio />}
                label="Write"
              />
            </RadioGroup>
          </Box>
          <Box
            sx={{
              marginBottom: "20px",
            }}
          >
            <InputLabel id="select-users-label">Add People</InputLabel>
            <Autocomplete
              sx={{
                marginTop: "10px",
              }}
              options={users}
              getOptionLabel={(option) => option}
              value={selectedUsers}
              onChange={(event, newValue) => setSelectedUsers(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Add People"
                />
              )}
            />
          </Box>
          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleShare}
              disabled={selectedUsers.length === 0 || permission === ""}
            >
              Share
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

// custom action
export const ShareFiles = defineFileAction(
  {
    id: "share_files",
    button: {
      name: "Share",
      contextMenu: true,
      toolbar: true,
      group: "Actions",
      icon: ChonkyIconName.share,
      requiresSelection: true,
    },
  },
  ({ state }) => {
    const files = state.selectedFiles;
    return {
      files,
    };
    //
  }
);
