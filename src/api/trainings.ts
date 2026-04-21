import { API_URL } from '../constants/api';
import type { Training } from '../types/training';

export async function getTrainings(): Promise<Training[]> {
  const response = await fetch(`${API_URL}/gettrainings`);

  if (!response.ok) {
    throw new Error('Failed to fetch trainings');
  }

  const data: Training[] = await response.json();
  return data;
}