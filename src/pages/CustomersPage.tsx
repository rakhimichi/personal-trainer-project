import { useEffect, useMemo, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import {
  Alert,
  Box,
  CircularProgress,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid, type GridColDef, type GridRowsProp } from '@mui/x-data-grid';
import { getCustomers } from '../api/customers';
import type { Customer } from '../types/customer';

function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getCustomers();
        setCustomers(data);
      } catch (err) {
        setError('Failed to load customers');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return customers;
    }

    return customers.filter((customer) =>
      [
        customer.firstname,
        customer.lastname,
        customer.streetaddress,
        customer.postcode,
        customer.city,
        customer.email,
        customer.phone,
      ]
        .join(' ')
        .toLowerCase()
        .includes(term)
    );
  }, [customers, search]);

  const rows: GridRowsProp = filteredCustomers.map((customer) => ({
    id: customer._links.self.href,
    firstname: customer.firstname,
    lastname: customer.lastname,
    streetaddress: customer.streetaddress,
    postcode: customer.postcode,
    city: customer.city,
    email: customer.email,
    phone: customer.phone,
  }));

  const columns: GridColDef[] = [
    { field: 'firstname', headerName: 'First name', flex: 1, minWidth: 140 },
    { field: 'lastname', headerName: 'Last name', flex: 1, minWidth: 140 },
    { field: 'streetaddress', headerName: 'Address', flex: 1.4, minWidth: 180 },
    { field: 'postcode', headerName: 'Postcode', flex: 0.8, minWidth: 110 },
    { field: 'city', headerName: 'City', flex: 1, minWidth: 130 },
    { field: 'email', headerName: 'Email', flex: 1.4, minWidth: 220 },
    { field: 'phone', headerName: 'Phone', flex: 1, minWidth: 150 },
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Customers
      </Typography>

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          label="Search customers"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name, city, email, phone..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ height: 600, width: '100%' }}>
        {loading ? (
          <Box
            sx={{
              height: '100%',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 20]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
          />
        )}
      </Paper>
    </Box>
  );
}

export default CustomersPage;