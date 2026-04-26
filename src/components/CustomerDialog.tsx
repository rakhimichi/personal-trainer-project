import { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import type { Customer, CustomerFormData } from '../types/customer';

const emptyCustomer: CustomerFormData = {
  firstname: '',
  lastname: '',
  streetaddress: '',
  postcode: '',
  city: '',
  email: '',
  phone: '',
};

type CustomerDialogProps = {
  open: boolean;
  customer?: Customer | null;
  onClose: () => void;
  onSave: (customer: CustomerFormData) => void;
};

function CustomerDialog({ open, customer, onClose, onSave }: CustomerDialogProps) {
  const [formData, setFormData] = useState<CustomerFormData>(emptyCustomer);

  useEffect(() => {
    if (customer) {
      setFormData({
        firstname: customer.firstname,
        lastname: customer.lastname,
        streetaddress: customer.streetaddress,
        postcode: customer.postcode,
        city: customer.city,
        email: customer.email,
        phone: customer.phone,
      });
    } else {
      setFormData(emptyCustomer);
    }
  }, [customer, open]);

  const handleChange = (field: keyof CustomerFormData, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{customer ? 'Edit customer' : 'Add customer'}</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="First name"
            value={formData.firstname}
            onChange={(event) => handleChange('firstname', event.target.value)}
            fullWidth
          />

          <TextField
            label="Last name"
            value={formData.lastname}
            onChange={(event) => handleChange('lastname', event.target.value)}
            fullWidth
          />

          <TextField
            label="Street address"
            value={formData.streetaddress}
            onChange={(event) => handleChange('streetaddress', event.target.value)}
            fullWidth
          />

          <TextField
            label="Postcode"
            value={formData.postcode}
            onChange={(event) => handleChange('postcode', event.target.value)}
            fullWidth
          />

          <TextField
            label="City"
            value={formData.city}
            onChange={(event) => handleChange('city', event.target.value)}
            fullWidth
          />

          <TextField
            label="Email"
            value={formData.email}
            onChange={(event) => handleChange('email', event.target.value)}
            fullWidth
          />

          <TextField
            label="Phone"
            value={formData.phone}
            onChange={(event) => handleChange('phone', event.target.value)}
            fullWidth
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CustomerDialog;