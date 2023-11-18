import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Unstable_Grid2";
import axios from "axios";
import folder from "../Assets/folder_icon.png";
import doc from "../Assets/doc_icon.png";
import video from "../Assets/video_icon.png";
import audio from "../Assets/audio_icon.png";
import image from "../Assets/image_icon.png";
import pdf from "../Assets/pdf_icon.png";
import csv from "../Assets/csv_icon.png";
import file from "../Assets/file_icon.png";
import FilePreview from "./FilePreview";
import { extractFiletype } from "../utils/extract-filetype";
import IconMenu from "./ContextMenu";
import ls from "local-storage";

const mapFileToIcon = {
  png: image,
  jpg: image,
  jpeg: image,
  gif: image,
  bmp: image,
  svg: image,
  mp4: video,
  avi: video,
  mkv: video,
  mov: video,
  wmv: video,
  mp3: audio,
  wav: audio,
  aac: audio,
  wma: audio,
  ogg: audio,
  pdf: pdf,
  doc: doc,
  docx: doc,
  xls: csv,
  xlsx: csv,
  csv: csv,
  txt: file,
};

function getDisplayIconSrc(name) {
  if (isFolder(name)) {
    return folder;
  } else {
    let arr = name.split(".");
    let ext = arr[arr.length - 1].toLowerCase();
    if (ext in mapFileToIcon) {
      return mapFileToIcon[ext];
    } else {
      return file;
    }
  }
}
function getFileSize(bytes, dp = 1) {
  const thresholdBytes = 1024;
  if (Math.abs(bytes) < thresholdBytes) {
    return bytes + " B";
  }
  const units = ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresholdBytes;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresholdBytes &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + " " + units[u];
}

function isFolder(name) {
  return name.endsWith("/");
}

function createData(id, name, size, lastModified, etag, url) {
  return {
    id,
    name: name,
    size: isFolder(name) ? "-" : getFileSize(size),
    lastModified,
    etag,
    url,
  };
}

function previewName(name) {
  if (isFolder(name)) {
    let last = name.slice(0, name.length - 1);
    let arr = last.split("/");
    return arr[arr.length - 1];
  } else {
    let arr = name.split("/");
    return arr[arr.length - 1];
  }
}

export default function ThumbnailView(props) {
  const [rows, setRows] = React.useState([]);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [fileData, setFileData] = React.useState("");
  const [fileName, setFileName] = React.useState("");

  const [contextMenu, setContextMenu] = React.useState({
    visible: false,
    x: 0,
    y: 0,
  });

  const handleContextMenu = (event) => {
    event.preventDefault();
    setContextMenu({ visible: true, x: event.clientX, y: event.clientY });
  };

  const handleClose = () => {
    setContextMenu({ visible: false, x: 0, y: 0 });
  };

  const handleFolderClick = (props) => {
    if (isFolder(props.name)) {
      const folder_name = previewName(props.name);
      const path = props.currentDirectory + folder_name + "/";
      props.setCurrentDirectory(path);
    } else {
      setModalOpen(true);
      console.log(props.url);
      setFileData(props.url);
      setFileName(props.name);
    }
  };

  React.useEffect(() => {
    axios
      .post("http://localhost:5000/list_objects", {
        bucket_name: ls.get("email"),
        prefix: props.currentDirectory.substring(1),
      })
      .then((response) => {
        let row = [];
        let id = 1;
        response.data.objects.forEach((object) => {
          row.push(
            createData(
              id,
              object.object_name,
              object.size,
              object.last_modified,
              object.etag,
              object
            )
          );
          id += 1;
          console.log(object.object_name);
        });
        setRows(row);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [props.currentDirectory]);
  return (
    <Stack direction="row" spacing={2} width="100%">
      <Grid
        style={{ height: 600, width: "20%" }}
        container
        spacing={2}
        onClick={handleClose}
        number
        of
        columns={3}
        rowSpacing={1}
      >
        {rows.map((file, index) => (
          <Grid
            item
            xs={1}
            key={index}
            onContextMenu={(event) => {
              handleContextMenu(event);
            }}
            onClick={() => {
              handleFolderClick({
                name: file.name,
                url: file.url,
                currentDirectory: props.currentDirectory,
                setCurrentDirectory: props.setCurrentDirectory,
              });
            }}
          >
            <IconMenu
              sx={{
                visibility: contextMenu.visible ? "visible" : "hidden",
                position: "absolute",
                top: contextMenu.y,
                left: contextMenu.x,
              }}
            />
            <img src={getDisplayIconSrc(file.name)} alt={file.name} />
            {!isFolder(file.name) ? (
              <FilePreview
                showIcon={false}
                open={modalOpen}
                setOpen={setModalOpen}
                previewName={previewName(file.name)}
                fileName="Preview"
                fileData={file.url}
                type={extractFiletype(file.name)}
              />
            ) : (
              <div>{previewName(file.name)}</div>
            )}
          </Grid>
        ))}
      </Grid>
      <Box style={{ height: 600, width: "80%", backgroundColor: "lightgrey" }}>
        {/* <FilePreview
          open={modalOpen}
          fileName="Preview"
          showIcon={true}
          fileData={params.api.getCellValue(params.id, "url")}
          type={extractFiletype(params.api.getCellValue(params.id, "name"))}
        /> */}
      </Box>
    </Stack>
  );
}
