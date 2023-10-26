import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Typography } from '@mui/material';
import axios from 'axios';
import FilePreview from './filePreview';
import BasicModal from './modal';
import PdfRender from './pdfViewer';
import { extractFiletype, extractFiletypeIcon } from '../utils/extract-filetype';

// Generate Order Data
function createData(id, name, size, lastModified, etag, url) {
  return {
    name,
    size,
    lastModified,
    etag,
    url,
  };
}


function preventDefault(event) {
  event.preventDefault();
}

export default function Orders() {
  const [rows, setRows] = React.useState([]);
  React.useEffect(() => {
    axios.post('http://localhost:5000/list_objects', {
      "bucket_name": "my-bucket"
    })
      .then((response) => {
        let row = [];
        let id = 1;
        response.data.objects.forEach((object) => {
          row.push(createData(id, object.object_name, object.size, object.last_modified, object.etag, object));
          console.log(object);  
        }
        );
        setRows(row);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [url, setUrl] = React.useState('');
  const handleFileClick = (event) => {
    setModalOpen(true);
  };
  return (
    <React.Fragment>
      <Typography align='left' component="h2" variant="h6" color="primary" gutterBottom>
        Recent Files
      </Typography>
      <Table size="medium">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Last Accessed</TableCell>
            <TableCell>Owned By</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.etag} sx={{ cursor: 'pointer' }} hover >
              <TableCell onClick={handleFileClick}>
                <FilePreview
                  open={modalOpen}
                  fileName={row.name}
                  fileData={row.url}
                  type={extractFiletype(row.name)}
                />
              </TableCell>
              <TableCell>{row.size}</TableCell>
              <TableCell>{row.lastModified}</TableCell>
              <TableCell>{row.etag}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
        Load More Files
      </Link>
    </React.Fragment>
  );
}