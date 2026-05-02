import { useEffect, useMemo, useState } from 'react';
import { groupBy, sumBy } from 'lodash';
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Paper,
  Typography,
} from '@mui/material';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getTrainings } from '../api/trainings';
import type { Training } from '../types/training';

type StatisticsRow = {
  activity: string;
  minutes: number;
};

function StatisticsPage() {
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
        setError('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchTrainings();
  }, []);

  const chartData = useMemo<StatisticsRow[]>(() => {
    const groupedTrainings = groupBy(trainings, 'activity');

    return Object.entries(groupedTrainings)
      .map(([activity, activityTrainings]) => ({
        activity,
        minutes: sumBy(activityTrainings, 'duration'),
      }))
      .sort((a, b) => b.minutes - a.minutes);
  }, [trainings]);

  const totalMinutes = useMemo(
    () => sumBy(trainings, 'duration'),
    [trainings]
  );

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Statistics
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(3, 1fr)',
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Card>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              Total trainings
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {trainings.length}
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              Total minutes
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {totalMinutes}
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              Activities
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {chartData.length}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 3,
          height: 560,
        }}
      >
        {loading ? (
          <Box sx={{ height: '100%', display: 'grid', placeItems: 'center' }}>
            <CircularProgress />
          </Box>
        ) : chartData.length === 0 ? (
          <Box sx={{ height: '100%', display: 'grid', placeItems: 'center' }}>
            <Typography color="text.secondary">
              No training statistics available
            </Typography>
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 10,
                bottom: 80,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="activity"
                angle={-35}
                textAnchor="end"
                interval={0}
                height={90}
              />
              <YAxis
                label={{
                  value: 'Minutes',
                  angle: -90,
                  position: 'insideLeft',
                }}
              />
              <Tooltip />
              <Bar dataKey="minutes" name="Minutes" fill="#1565c0" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Paper>
    </Box>
  );
}

export default StatisticsPage;