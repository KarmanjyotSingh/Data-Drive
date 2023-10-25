import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import "./Data.css";

function Data(props) {
  const columns = [
    { field: 'id', headerName: 'ID', width: 100},
    { field: 'object_name', headerName: 'Name', width: 200 },
    { field: 'size', headerName: 'Size', width: 150 },
    { field: 'etag', headerName: 'etag', width: 200 },
  ];

  const [selectedRow, setSelectedRow] = useState(null);

  const handleRowClick = (params) => {
    setSelectedRow(params.id);
  };

  const getRowClassName = (params) => {
    return params.id === selectedRow ? 'highlighted' : '';
  };

  const rows = props.objects.map((object, index) => {
    return {
      id: index+1,
      object_name: object.object_name,
      size: object.size,
      etag: object.etag,
    };
  });

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        getRowClassName={getRowClassName}
        onRowClick={handleRowClick}
      />
    </div>
  );
}

export default Data;