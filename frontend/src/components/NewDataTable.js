import React from "react";
import axios from "axios";
import ls from "local-storage";
import Button from "@mui/material/Button";
import { red, yellow } from "@mui/material/colors";
import { DataGrid, GridCloseIcon } from "@mui/x-data-grid";
import FilePreview from "./FilePreview";
import {
  extractFiletype,
  extractFiletypeIcon,
} from "../utils/extract-filetype";
import { isFolder, previewName, createData } from "../utils/table-utils";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import FolderIcon from "@mui/icons-material/Folder";
import InfoIcon from "@mui/icons-material/Info";
import "./NewDataTable.css";

export default function DataGridDemo(props) {
  const [rows, setRows] = React.useState([]);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [metadata, setMetadata] = React.useState("");
  const [metaDataOpen, setMetaDataOpen] = React.useState(false);

  const handleDownloadClick = (props) => {
    const object_name = props.name;
    const bucket_name = ls.get("email");
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
    const bucket_name = ls.get("email");
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

  const handleInfoClick = (props) => {
    // open the modal and show the metadata
    setMetadata(props.metadata);
    setMetaDataOpen(true);
    console.log(props.metadata);
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
      flex: 2,
      minWidth: 200,
      sortable: true,
      renderCell: (params) => {
        return (
          <React.Fragment>
            {isFolder(params.api.getCellValue(params.id, "name")) ? (
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
      flex: 1,
      headerAlign: "right",
      align: "right",
    },
    {
      field: "lastModified",
      headerName: "Last Modified",
      flex: 2,
      minWidth: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      headerName: "",
      sortable: false,
      flex: 5,
      minWidth: 200,
      align: "right",
      headerAlign: "right",
      renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation();
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
            {!isFolder(params.api.getCellValue(params.id, "name")) ? (
              <Button
                onClick={() =>
                  handleInfoClick({
                    metadata: params.api.getCellValue(params.id, "metadata"),
                  })
                }
                sx={{
                  textTransform: "none",
                  opacity: 1,
                  transition: "opacity 0.2s ease-in-out",
                  width: 10,
                }}
              >
                <InfoIcon />
              </Button>
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
              <DeleteIcon sx={{ color: red[500] }} />
            </Button>
          </React.Fragment>
        );
      },
    },
  ];

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
              object.metadata,
              object
            )
          );
          id += 1;
        });
        console.log(row);
        setRows(row);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [props.currentDirectory]);

  return (
    <div
      style={{
        height: 600,
        width: "100%",
        margin: 0,
        display: "flex",
        flexDirection: "row",
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        isRowSelectable={(params) => false}
        disableSelectionOnClick={true}
        disableColumnSelector={true}
        disableColumnMenu
        sx={{
          border: "none",
          margin: 0,
          "& .MuiDataGrid-cell:hover": {
            color: red[500],
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold",
            fontSize: 16,
          },
        }}
      />
      <div className={`Modal ${metaDataOpen ? "Show" : ""}`}>
        <h3>Metadata</h3>
        <button
          className="Close"
          onClick={() => setMetaDataOpen(!metaDataOpen)}
        >
          <GridCloseIcon />
        </button>
        {Object.entries(metadata).map(([key, value]) => (
          <>
            <p className="Text">
              {key} : {value}
            </p>
          </>
        ))}{" "}
      </div>
      <div
        className={`Overlay ${metaDataOpen ? "Show" : ""}`}
        onClick={() => setMetaDataOpen(!metaDataOpen)}
      />
    </div>
  );
}
