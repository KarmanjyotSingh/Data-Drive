import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import VisibilityIcon from "@mui/icons-material/Visibility";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  display: "flex",
  height: "90%",
  width: "60%",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const BasicModal = (props) => {
  const [open, setOpen] = React.useState(props.open);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <div>
      {props.showIcon ? (
        <Button onClick={handleOpen} sx={{ fontFamily: "monospace" }}>
          {<VisibilityIcon />}
        </Button>
      ) : (
        <div onClick={handleOpen}>{props.previewName}</div>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {props.title}
          </Typography>
          <Typography
            id="modal-modal-description"
            sx={{ mt: 2, overflow: "auto" }}
          >
            {props.body}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default BasicModal;
