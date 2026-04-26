import { API_URL } from '../constants/api';
import type { Training, TrainingFormData } from '../types/training';

export async function getTrainings(): Promise<Training[]> {
  const response = await fetch(`${API_URL}/gettrainings`);

  if (!response.ok) {
    throw new Error('Failed to fetch trainings');
  }

  const data: Training[] = await response.json();
  return data;
}

export async function addTraining(training: TrainingFormData): Promise<void> {
  const response = await fetch(`${API_URL}/trainings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(training),
  });

  if (!response.ok) {
    throw new Error('Failed to add training');
  }
}

export async function deleteTraining(trainingId: number): Promise<void> {
  const response = await fetch(`${API_URL}/trainings/${trainingId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete training');
  }
}