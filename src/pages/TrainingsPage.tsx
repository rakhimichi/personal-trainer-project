import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
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
import { getCustomers } from '../api/customers';
import { addTraining, deleteTraining, getTrainings } from '../api/trainings';
import ConfirmDialog from '../components/ConfirmDialog';
import TrainingDialog from '../components/TrainingDialog';
import type { Customer } from '../types/customer';
import type { Training, TrainingFormData } from '../types/training';

function TrainingsPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState('');
  const [trainingDialogOpen, setTrainingDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [trainingToDelete, setTrainingToDelete] = useState<Training | null>(null);

  const fetchTrainings = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getTrainings();
      setTrainings(data);
    } catch {
      setError('Failed to load trainings');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch {
      setError('Failed to load customers');
    }
  };

  useEffect(() => {
    fetchTrainings();
    fetchCustomers();
  }, []);

  const filteredTrainings = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return trainings;
    }

    return trainings.filter((training) =>
      [
        training.activity,
        training.duration,
        training.customer.firstname,
        training.customer.lastname,
        dayjs(training.date).format('DD.MM.YYYY HH:mm'),
      ]
        .join(' ')
        .toLowerCase()
        .includes(term)
    );
  }, [trainings, search]);

  const handleSaveTraining = async (trainingData: TrainingFormData) => {
    try {
      await addTraining(trainingData);
      setNotification('Training added');
      setTrainingDialogOpen(false);
      fetchTrainings();
    } catch {
      setError('Failed to add training');
    }
  };

  const handleDeleteClick = (training: Training) => {
    setTrainingToDelete(training);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!trainingToDelete) {
      return;
    }

    try {
      await deleteTraining(trainingToDelete.id);
      setNotification('Training deleted');
      setDeleteDialogOpen(false);
      setTrainingToDelete(null);
      fetchTrainings();
    } catch {
      setError('Failed to delete training');
    }
  };

  const rows: GridRowsProp = filteredTrainings.map((training) => ({
    id: training.id,
    date: dayjs(training.date).format('DD.MM.YYYY HH:mm'),
    duration: training.duration,
    activity: training.activity,
    customer: `${training.customer.firstname} ${training.customer.lastname}`,
    training,
  }));

  const columns: GridColDef[] = [
    { field: 'date', headerName: 'Date', flex: 1.1, minWidth: 180 },
    { field: 'activity', headerName: 'Activity', flex: 1.2, minWidth: 180 },
    {
      field: 'duration',
      headerName: 'Duration (min)',
      flex: 0.9,
      minWidth: 140,
      type: 'number',
    },
    { field: 'customer', headerName: 'Customer', flex: 1.2, minWidth: 180 },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      filterable: false,
      minWidth: 90,
      renderCell: (params) => (
        <IconButton color="error" onClick={() => handleDeleteClick(params.row.training)}>
          <DeleteIcon />
        </IconButton>
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
          Trainings
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setTrainingDialogOpen(true)}
        >
          Add training
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          label="Search trainings"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by activity, customer or date..."
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

      <TrainingDialog
        open={trainingDialogOpen}
        customers={customers}
        onClose={() => setTrainingDialogOpen(false)}
        onSave={handleSaveTraining}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete training"
        message="Are you sure you want to delete this training?"
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

export default TrainingsPage;