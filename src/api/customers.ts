import { API_URL } from '../constants/api';
import type { Customer, CustomersResponse } from '../types/customer';

export async function getCustomers(): Promise<Customer[]> {
  const response = await fetch(`${API_URL}/customers`);

  if (!response.ok) {
    throw new Error('Failed to fetch customers');
  }

  const data: CustomersResponse = await response.json();
  return data._embedded?.customers ?? [];
}