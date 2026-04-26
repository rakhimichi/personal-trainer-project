import { useState } from 'react';
import dayjs, { type Dayjs } from 'dayjs';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import type { Customer } from '../types/customer';
import type { TrainingFormData } from '../types/training';

type TrainingDialogProps = {
  open: boolean;
  customers: Customer[];
  onClose: () => void;
  onSave: (training: TrainingFormData) => void;
};

function TrainingDialog({ open, customers, onClose, onSave }: TrainingDialogProps) {
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [activity, setActivity] = useState('');
  const [duration, setDuration] = useState('');
  const [customerUrl, setCustomerUrl] = useState('');

  const resetForm = () => {
    setDate(dayjs());
    setActivity('');
    setDuration('');
    setCustomerUrl('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = () => {
    if (!date || !activity || !duration || !customerUrl) {
      return;
    }

    onSave({
      date: date.toISOString(),
      activity,
      duration: Number(duration),
      customer: customerUrl,
    });

    resetForm();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add training</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <DateTimePicker
            label="Date and time"
            value={date}
            onChange={(newDate) => setDate(newDate)}
            slotProps={{
              textField: {
                fullWidth: true,
              },
            }}
          />

          <TextField
            label="Activity"
            value={activity}
            onChange={(event) => setActivity(event.target.value)}
            fullWidth
          />

          <TextField
            label="Duration"
            type="number"
            value={duration}
            onChange={(event) => setDuration(event.target.value)}
            fullWidth
          />

          <TextField
            label="Customer"
            select
            value={customerUrl}
            onChange={(event) => setCustomerUrl(event.target.value)}
            fullWidth
          >
            {customers.map((customer) => (
              <MenuItem key={customer._links.self.href} value={customer._links.self.href}>
                {customer.firstname} {customer.lastname}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TrainingDialog;