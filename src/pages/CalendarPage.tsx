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

      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 3,
          minHeight: 720,
          overflow: 'hidden',
        }}
      >
        {loading ? (
          <Box sx={{ height: 650, display: 'grid', placeItems: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box className="calendar-wrapper">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay',
              }}
              buttonText={{
                today: 'Today',
                month: 'Month',
                week: 'Week',
                day: 'Day',
              }}
              events={events}
              height="720px"
              nowIndicator
              allDaySlot={false}
              slotMinTime="06:00:00"
              slotMaxTime="23:59:00"
              slotDuration="00:30:00"
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              }}
              eventDisplay="block"
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default CalendarPage;