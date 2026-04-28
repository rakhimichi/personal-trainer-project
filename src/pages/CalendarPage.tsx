import { useEffect, useMemo, useState } from 'react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Alert, Box, CircularProgress, Paper, Typography } from '@mui/material';
import { getTrainings } from '../api/trainings';
import type { Training } from '../types/training';

function CalendarPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
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
        setError('Failed to load calendar trainings');
      } finally {
        setLoading(false);
      }
    };

    fetchTrainings();
  }, []);

  const events = useMemo(
    () =>
      trainings.map((training) => ({
        id: String(training.id),
        title: `${training.activity} / ${training.customer.firstname} ${training.customer.lastname}`,
        start: training.date,
        end: new Date(
          new Date(training.date).getTime() + training.duration * 60000
        ).toISOString(),
      })),
    [trainings]
  );

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Calendar
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, minHeight: 650 }}>
        {loading ? (
          <Box sx={{ height: 600, display: 'grid', placeItems: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            events={events}
            height="auto"
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            }}
          />
        )}
      </Paper>
    </Box>
  );
}

export default CalendarPage;