import React from "react";
import { useState, useEffect } from "react";
import PdfRender from "../utils/pdfViewer";
import { Modal, Box } from "@mui/material";
import BasicModal from "./Modal";
function data(props) {
    return {
        fileName: props.fileName,
        fileData: props.fileData,
        type: props.type
    }
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};
function FilePreview(props) {

    const fetchedData = data(props);
    const [open, setOpen] = useState(true);
    // useEffect(() => {
    //     setFetchedData(data(props));
    //     console.log(fetchedData);
    //     // setFetchedData(data("test", "https://cdn.filestackcontent.com/wcrjf9qPTCKXV3hMXDwK", "pdf"));
    //     // setFetchedData(data("test", "https://www.shutterstock.com/image-vector/sample-red-square-grunge-stamp-260nw-338250266.jpg", "img"));
    //     // setFetchedData(data("test", "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4", "video"));
    //     // setFetchedData(data("test", "https://dl.espressif.com/dl/audio/ff-16b-2c-44100hz.mp4", "1223"));
    // }, []);
    // setFetchedData();
    return (
        <React.Fragment>
            {fetchedData.type === "pdf" ? (
                <BasicModal
                    open={props.open}
                    fileName={fetchedData.fileName}
                    body={
                        <PdfRender fileData={fetchedData.fileData.url} />
                    }
                >
                </BasicModal>

            ) : fetchedData.type === "image" ? (
                <BasicModal
                    open={props.open}
                    fileName={fetchedData.fileName}
                    body={
                        <img
                            style={{ maxHeight: '100%', maxWidth: '100%' }}
                            src={fetchedData.fileData.url}
                            alt={fetchedData.fileName}
                        />}>
                </BasicModal>
            ) : fetchedData.type === "txt" ? (
                <Modal open={true}>
                    <Box sx={style}>
                        <p>{fetchedData.fileData}</p>
                    </Box>
                </Modal>
            ) : fetchedData.type === "audio" ? (
                <BasicModal
                    open={props.open}
                    fileName={fetchedData.fileName}
                    title={fetchedData.fileName}
                    body={
                        <audio controls>
                            <source src={fetchedData.fileData} type="audio/mpeg" />
                        </audio>
                    }>
                </BasicModal>
            ) : fetchedData.type === "video" ? (
                <BasicModal
                    open={props.open}
                    fileName={fetchedData.fileName}
                    body={
                        <video width="320" height="240" controls>
                            <source src={fetchedData.fileData} type="video/mp4" />
                        </video>
                    }
                    title={fetchedData.fileName}>
                </BasicModal>
            ) :
                <BasicModal open={true}
                    title="File Type Not Supported"
                    body={
                        <img src="https://static.thenounproject.com/png/3876328-200.png" />
                    }
                >
                </BasicModal>

            }

        </React.Fragment >
    )
}

export default FilePreview;