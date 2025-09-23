import { useEffect, useState } from 'react';
import { Task } from '@/types/taskTypes';
import { fetchTasks } from '@/services/taskService';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    async function getData() {
      try {
        const data = await fetchTasks();
        setTasks(data as Task[]);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, []);

  return { tasks, loading, error };
}
