import React from "react";
import { useState, useEffect } from "react";
import PdfRender from "../utils/pdfViewer";
import { Modal, Box } from "@mui/material";
import BasicModal from "./Modal";

function data(props) {
  return {
    fileName: props.fileName,
    fileData: props.fileData,
    type: props.type,
  };
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};
function FilePreview(props) {
  const fetchedData = data(props);
  const [open, setOpen] = useState(true);

  return (
    <React.Fragment>
      {fetchedData.type === "pdf" ? (
        <BasicModal
          {...props}
          open={props.open}
          showIcon={props.showIcon}
          fileName={fetchedData.fileName}
          body={<PdfRender fileData={fetchedData.fileData.url} />}
        ></BasicModal>
      ) : fetchedData.type === "image" ? (
        <BasicModal
          {...props}
          open={props.open}
          fileName={fetchedData.fileName}
          showIcon={props.showIcon}
          body={
            <img
              style={{
                // align image to center
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",

                maxHeight: "100%",
                maxWidth: "100%",
              }}
              src={fetchedData.fileData.url}
              alt={fetchedData.fileName}
            />
          }
        ></BasicModal>
      ) : fetchedData.type === "txt" ? (
        <Modal open={true}>
          <Box sx={style}>
            <p>{fetchedData.fileData}</p>
          </Box>
        </Modal>
      ) : fetchedData.type === "audio" ? (
        <BasicModal
          open={props.open}
          {...props}
          fileName={fetchedData.fileName}
          title={fetchedData.fileName}
          showIcon={props.showIcon}
          body={
            <audio controls>
              <source src={fetchedData.fileData} type="audio/mpeg" />
            </audio>
          }
        ></BasicModal>
      ) : fetchedData.type === "video" ? (
        <BasicModal
          open={props.open}
          {...props}
          fileName={fetchedData.fileName}
          showIcon={props.showIcon}
          body={
            <video width="320" height="240" controls>
              <source src={fetchedData.fileData} type="video/mp4" />
            </video>
          }
          title={fetchedData.fileName}
        ></BasicModal>
      ) : (
        <BasicModal
          open={props.open}
          {...props}
          title="File Type Not Supported"
          showIcon={props.showIcon}
          alignItems="center"
          body={
            <React.Fragment>
              <img
                src="https://static.thenounproject.com/png/3876328-200.png"
                alt="Error"
                style={{
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              />
              <p>Please Download the File, Preview not available</p>
            </React.Fragment>
          }
        ></BasicModal>
      )}
    </React.Fragment>
  );
}

export default FilePreview;
