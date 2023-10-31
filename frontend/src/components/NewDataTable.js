import React from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import { DataGrid, GridColDef, GridApi, GridCellValue } from "@mui/x-data-grid";
import FilePreview from "./FilePreview";
import {
  extractFiletype,
  extractFiletypeIcon,
} from "../utils/extract-filetype";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";
import Folder from "@mui/icons-material/Folder";
import { red, yellow } from "@mui/material/colors";

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

export default function DataGridDemo(props) {
  const [rows, setRows] = React.useState([]);
  const [modalOpen, setModalOpen] = React.useState(false);

  const handleDownloadClick = (props) => {
    const object_name = props.name;
    const bucket_name = "my-bucket";
    console.log(props);
    axios
      .post("http://localhost:5000/get_downloadURL", {
        bucket_name: bucket_name,
        object_name: object_name,
      })
      .then((response) => {
        // the response returns a key url which is the download url
        const link = document.createElement("a");
        link.href = response.data.url;
        link.target = "_blank";
        document.body.appendChild(link);

        link.click();
        document.body.removeChild(link);
        //download should happen in a new tab
        //window.open(response.data.url, '_blank');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteClick = (props) => {
    const object_name = props.name;
    const bucket_name = "my-bucket";
    console.log(props);
    axios
      .post("http://localhost:5000/delete_object", {
        bucket_name: bucket_name,
        object_name: object_name,
      })
      .then((response) => {
        console.log(response);
        //  delete the row from the table
        setRows(rows.filter((row) => row.name !== props.name));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleFolderClick = (props) => {
    const folder_name = previewName(props.name);
    const path = props.currentDirectory + folder_name + "/";
    props.setCurrentDirectory(path);
    console.log(props);
  };
  const columns = [
    {
      field: "name",
      headerName: "File Name",
      width: 400,
      sortable: true,
      renderCell: (params) => {
        return (
          <React.Fragment>
            {isFolder(params.api.getCellValue(params.id, "name")) ? (
              // change color to yellow
              <FolderIcon color="yellow" />
            ) : (
              extractFiletypeIcon(params.api.getCellValue(params.id, "name"))
            )}
            &nbsp; &nbsp;
            {isFolder(params.api.getCellValue(params.id, "name")) ? (
              <Button
                onClick={() =>
                  handleFolderClick({
                    name: params.api.getCellValue(params.id, "name"),
                    currentDirectory: props.currentDirectory,
                    setCurrentDirectory: props.setCurrentDirectory,
                  })
                }
                sx={{
                  textTransform: "none",
                  opacity: 1,
                  transition: "opacity 0.2s ease-in-out",
                  width: 10,
                }}
              >
                {previewName(params.api.getCellValue(params.id, "name"))}
              </Button>
            ) : (
              <>{previewName(params.api.getCellValue(params.id, "name"))}</>
            )}
          </React.Fragment>
        );
      },
    },
    {
      field: "size",
      headerName: "Size",
      width: 150,
      //  align cell to the right
      headerAlign: "right",
      align: "right",
    },
    {
      field: "lastModified",
      headerName: "Last Modified",
      width: 400,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      headerName: "",
      sortable: false,
      width: 450,
      align: "right",
      headerAlign: "right",
      // disa
      renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation(); // don't select this row after clicking

          // const api = params.api;
          // const thisRow = {};

          console.log(params);

          // return alert(JSON.stringify(thisRow, null, 4));
        };

        return (
          <React.Fragment>
            {!isFolder(params.api.getCellValue(params.id, "name")) ? (
              <FilePreview
                open={modalOpen}
                fileName="Preview"
                showIcon={true}
                fileData={params.api.getCellValue(params.id, "url")}
                type={extractFiletype(
                  params.api.getCellValue(params.id, "name")
                )}
              />
            ) : null}
            <Button
              onClick={() =>
                handleDownloadClick({
                  name: params.api.getCellValue(params.id, "name"),
                })
              }
              sx={{
                textTransform: "none",
                opacity: 1,
                transition: "opacity 0.2s ease-in-out",
                width: 10,
              }}
            >
              <DownloadIcon />
            </Button>
            <Button
              onClick={() =>
                handleDeleteClick({
                  name: params.api.getCellValue(params.id, "name"),
                })
              }
              sx={{
                textTransform: "none",
                opacity: 1,
                transition: "opacity 0.2s ease-in-out",
                width: 10,
              }}
            >
              <DeleteIcon />
            </Button>
          </React.Fragment>
        );
      },
    },
  ];

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
    <div style={{ height: 600, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        isRowSelectable={(params) => false}
        // checkboxSelection
        //disable menu filters
        disableColumnMenu
        sx={{
          boxShadow: 2,
          border: 2,
          borderColor: "#2E3B55",
          "& .MuiDataGrid-cell:hover": {
            color: red[500],
          },
          //headers bold, font size 16
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold",
            fontSize: 16,
          },
        }}
      />
    </div>
  );
}
