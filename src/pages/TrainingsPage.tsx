import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import SearchIcon from '@mui/icons-material/Search';
import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { DataGrid, type GridColDef, type GridRowsProp } from '@mui/x-data-grid';
import { getTrainings } from '../api/trainings';
import type { Training } from '../types/training';

function TrainingsPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
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

    fetchTrainings();
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

  const rows: GridRowsProp = filteredTrainings.map((training) => ({
    id: training.id,
    date: dayjs(training.date).format('DD.MM.YYYY HH:mm'),
    duration: training.duration,
    activity: training.activity,
    customer: `${training.customer.firstname} ${training.customer.lastname}`,
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
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Trainings
      </Typography>

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

export default TrainingsPage;