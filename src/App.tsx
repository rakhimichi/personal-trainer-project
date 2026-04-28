import { Navigate, Route, Routes } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Navbar from './components/Navbar';
import CustomersPage from './pages/CustomersPage';
import TrainingsPage from './pages/TrainingsPage';
import CalendarPage from './pages/CalendarPage';

function App() {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f6f8fb' }}>
      <Navbar />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/customers" replace />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/trainings" element={<TrainingsPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
        </Routes>
      </Container>
    </Box>
  );
}

export default App;
