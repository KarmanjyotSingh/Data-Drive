import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
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
import BasicModal from "./Modal";

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
        bucket_name: "my-bucket",
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
    <Grid style={{ height: 600, width: "100%" }} container spacing={3}>
      {rows.map((file, index) => (
        <Grid
          item
          xs={1}
          key={index}
          onClick={() => {
            handleFolderClick({
              name: file.name,
              url: file.url,
              currentDirectory: props.currentDirectory,
              setCurrentDirectory: props.setCurrentDirectory,
            });
          }}
        >
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
  );
}
