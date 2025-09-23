import { Task } from '@/types/taskTypes';
import { apiFetch } from './api';

export async function fetchTasks() {
  return apiFetch('/task', {
    method: 'GET',
  });
}

export function createTask(data: Task) {
  return apiFetch<string>(`/task`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateTask(data: Partial<Task>) {
  return apiFetch<string>(`/task`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteTask(id: string) {
  return apiFetch<string>(`/task/${id}`, {
    method: 'DELETE',
  });
}
