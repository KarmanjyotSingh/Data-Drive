import React from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import { DataGrid, GridColDef, GridApi, GridCellValue } from "@mui/x-data-grid";
import FilePreview from "./FilePreview";
import { extractFiletype } from "../utils/extract-filetype";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";

function createData(id, name, size, lastModified, etag, url) {
  return {
    id: etag,
    name,
    size,
    lastModified,
    etag,
    url,
  };
}

export default function DataGridDemo() {
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

  const columns = [
    {
      field: "name",
      headerName: "File Name",
      width: 400,
      sortable: true,
    },
    { field: "size", headerName: "<Size>", width: 130 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 200,
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
            <FilePreview
              open={modalOpen}
              fileName="Preview"
              fileData={params.api.getCellValue(params.id, "url")}
              type={extractFiletype(params.api.getCellValue(params.id, "name"))}
            />
            <Button
              onClick={() => handleDownloadClick({
                name: params.api.getCellValue(params.id, "name"),
              })}
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
              onClick={() => handleDeleteClick({
                name: params.api.getCellValue(params.id, "name"),
              })}
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
        });
        setRows(row);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns} 
        
        isRowSelectable={(params) => false} 
        // checkboxSelection
        sx={{
          boxShadow: 2,
          border: 2,
          borderColor: "#2E3B55",
          "& .MuiDataGrid-cell:hover": {
            color: "primary.main",
          }
        }}
      />
    </div>
  );
}
