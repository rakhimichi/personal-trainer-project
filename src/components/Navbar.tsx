import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import GroupsIcon from '@mui/icons-material/Groups';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <AppBar position="sticky" elevation={1}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ gap: 2 }}>
          <FitnessCenterIcon />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 700 }}
          >
            Personal Trainer
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              component={NavLink}
              to="/customers"
              color="inherit"
              startIcon={<GroupsIcon />}
              sx={{
                '&.active': {
                  backgroundColor: 'rgba(255,255,255,0.16)',
                },
              }}
            >
              Customers
            </Button>

            <Button
              component={NavLink}
              to="/trainings"
              color="inherit"
              startIcon={<EventNoteIcon />}
              sx={{
                '&.active': {
                  backgroundColor: 'rgba(255,255,255,0.16)',
                },
              }}
            >
              Trainings
            </Button>

            <Button
              component={NavLink}
              to="/calendar"
              color="inherit"
              startIcon={<CalendarMonthIcon />}
              sx={{
                '&.active': {
                  backgroundColor: 'rgba(255,255,255,0.16)',
                },
              }}
            >
              Calendar
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;