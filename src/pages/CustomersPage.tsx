import { useEffect, useMemo, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid, type GridColDef, type GridRowsProp } from '@mui/x-data-grid';
import { addCustomer, deleteCustomer, getCustomers, updateCustomer } from '../api/customers';
import ConfirmDialog from '../components/ConfirmDialog';
import CustomerDialog from '../components/CustomerDialog';
import type { Customer, CustomerFormData } from '../types/customer';

function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState('');
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getCustomers();
      setCustomers(data);
    } catch {
      setError('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  const handleExportCsv = () => {
    const headers = [
      'First name',
      'Last name',
      'Street address',
      'Postcode',
      'City',
      'Email',
      'Phone',
    ];

    const csvRows = filteredCustomers.map((customer) => [
      customer.firstname,
      customer.lastname,
      customer.streetaddress,
      customer.postcode,
      customer.city,
      customer.email,
      customer.phone,
    ]);

    const csvContent = [headers, ...csvRows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(',')
      )
      .join('\n');

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'customers.csv';
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleAddClick = () => {
    setSelectedCustomer(null);
    setCustomerDialogOpen(true);
  };

  const handleEditClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerDialogOpen(true);
  };

  const handleDeleteClick = (customer: Customer) => {
    setCustomerToDelete(customer);
    setDeleteDialogOpen(true);
  };

  const handleSaveCustomer = async (customerData: CustomerFormData) => {
    try {
      if (selectedCustomer) {
        await updateCustomer(selectedCustomer._links.self.href, customerData);
        setNotification('Customer updated');
      } else {
        await addCustomer(customerData);
        setNotification('Customer added');
      }

      setCustomerDialogOpen(false);
      setSelectedCustomer(null);
      fetchCustomers();
    } catch {
      setError('Failed to save customer');
    }
  };

  const handleConfirmDelete = async () => {
    if (!customerToDelete) {
      return;
    }

    try {
      await deleteCustomer(customerToDelete._links.self.href);
      setNotification('Customer deleted');
      setDeleteDialogOpen(false);
      setCustomerToDelete(null);
      fetchCustomers();
    } catch {
      setError('Failed to delete customer');
    }
  };

  const rows: GridRowsProp = filteredCustomers.map((customer) => ({
    id: customer._links.self.href,
    firstname: customer.firstname,
    lastname: customer.lastname,
    streetaddress: customer.streetaddress,
    postcode: customer.postcode,
    city: customer.city,
    email: customer.email,
    phone: customer.phone,
    customer,
  }));

  const columns: GridColDef[] = [
    { field: 'firstname', headerName: 'First name', flex: 1, minWidth: 140 },
    { field: 'lastname', headerName: 'Last name', flex: 1, minWidth: 140 },
    { field: 'streetaddress', headerName: 'Address', flex: 1.4, minWidth: 180 },
    { field: 'postcode', headerName: 'Postcode', flex: 0.8, minWidth: 110 },
    { field: 'city', headerName: 'City', flex: 1, minWidth: 130 },
    { field: 'email', headerName: 'Email', flex: 1.4, minWidth: 220 },
    { field: 'phone', headerName: 'Phone', flex: 1, minWidth: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      minWidth: 120,
      renderCell: (params) => (
        <Box>
          <IconButton color="primary" onClick={() => handleEditClick(params.row.customer)}>
            <EditIcon />
          </IconButton>

          <IconButton color="error" onClick={() => handleDeleteClick(params.row.customer)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Customers
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExportCsv}
            disabled={filteredCustomers.length === 0}
          >
            Export CSV
          </Button>

          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddClick}>
            Add customer
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          label="Search customers"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name, city, email, phone..."
          slotProps={{
            input: {
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            },
          }}
        />
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Paper sx={{ height: 600, width: '100%' }}>
        {loading ? (
          <Box sx={{ height: '100%', display: 'grid', placeItems: 'center' }}>
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

      <CustomerDialog
        open={customerDialogOpen}
        customer={selectedCustomer}
        onClose={() => setCustomerDialogOpen(false)}
        onSave={handleSaveCustomer}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete customer"
        message="Are you sure you want to delete this customer and all related trainings?"
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      <Snackbar
        open={Boolean(notification)}
        autoHideDuration={3000}
        message={notification}
        onClose={() => setNotification('')}
      />
    </Box>
  );
}

export default CustomersPage;