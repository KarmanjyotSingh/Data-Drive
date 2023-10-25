import { useCallback, useMemo, useState } from 'react';
// import Head from 'next/head';
// import { subDays, subHours } from 'date-fns';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection as get } from '../hooks/use-selection';
// import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { ObjectsTable } from './object-table';
import { ObjectSearch } from './object-search';
import { applyPagination } from '../utils/apply-pagination';
import axios from 'axios';
import { set } from 'local-storage';
import usePagination from '@mui/material/usePagination/usePagination';

const useObjects = (data, page, rowsPerPage) => {
  return useMemo(
    () => {
      return applyPagination(data, page, rowsPerPage);
    },
    [page, rowsPerPage]
  );
};

const useObjectIds = (objects) => {
  return useMemo(
    () => {
      return objects.map((object) => object.etag);
    },
    [objects]
  );
};

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  
  const handlePageChange = useCallback(
    (event, value) => {
      setPage(value);
    },[]  
  );
    
  const handleRowsPerPageChange = useCallback(
    (event) => {
      setRowsPerPage(event.target.value);
  },[]);
      
  const [data, setData] = useState([]);
  const [objects, setObjects] = useState([]);
  const [objectIds, setObjectIds] = useState([]);
  const [objectsSelection, useObjecsSelection] = useState([]);

    useEffect(() => {
        const fetchObjects = async () => {
            const res = await axios.post("http://localhost:5000/list_objects", {
                    bucket_name: "bkt1"
            });
            setData(res.data.objects);
            setObjects(getObjects(data, page, rowsPerPage));
            setObjectIds(getObjectIds(objects));
            setSelected(useSelection(objectIds));
            console.log(res.data.objects);
        }
        fetchObjects();
    }
    , []);

  return (
    <>
      {/* <Head>
        <title>
          Customers | Devias Kit
        </title>
      </Head> */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">
                  My Space
                </Typography>
              </Stack>
              <div>
              <Stack
                  alignItems="center"
                  direction="row"
                  spacing={1}
                >
                  <Button
                    color="inherit"
                    startIcon={(
                      <SvgIcon fontSize="small">
                        <ArrowUpOnSquareIcon />
                      </SvgIcon>
                    )}
                  >
                    Upload
                  </Button>
                  <Button
                    color="inherit"
                    startIcon={(
                      <SvgIcon fontSize="small">
                        <ArrowDownOnSquareIcon />
                      </SvgIcon>
                    )}
                  >
                    Download
                  </Button>
                </Stack>
              </div>
            </Stack>
            <CustomersSearch />
            <ObjectsTable
              count={data.length}
              items={objects}
              onDeselectAll={objectsSelection.handleDeselectAll}
              onDeselectOne={objectsSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={objectsSelection.handleSelectAll}
              onSelectOne={objectsSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={objectsSelection.selected}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

// Page.getLayout = (page) => (
//   <DashboardLayout>
//     {page}
//   </DashboardLayout>
// );

export default Page;