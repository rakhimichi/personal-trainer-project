import { API_URL } from '../constants/api';
import type { Customer, CustomerFormData, CustomersResponse } from '../types/customer';

export async function getCustomers(): Promise<Customer[]> {
  const response = await fetch(`${API_URL}/customers`);

  if (!response.ok) {
    throw new Error('Failed to fetch customers');
  }

  const data: CustomersResponse = await response.json();
  return data._embedded?.customers ?? [];
}

export async function addCustomer(customer: CustomerFormData): Promise<void> {
  const response = await fetch(`${API_URL}/customers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customer),
  });

  if (!response.ok) {
    throw new Error('Failed to add customer');
  }
}

export async function updateCustomer(
  customerUrl: string,
  customer: CustomerFormData
): Promise<void> {
  const response = await fetch(customerUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customer),
  });

  if (!response.ok) {
    throw new Error('Failed to update customer');
  }
}

export async function deleteCustomer(customerUrl: string): Promise<void> {
  const response = await fetch(customerUrl, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete customer');
  }
}