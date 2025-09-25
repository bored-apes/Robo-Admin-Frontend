'use client';
import React from 'react';
import { useTasks } from '@/hooks/useTasks';
import { Task, TaskStatusEnum } from '@/types/taskTypes';
import { OwnerEnum } from '@/types/investmentTypes';

import {
  Box,
  CircularProgress,
  Typography,
  Card,
  Divider,
  Avatar,
  Chip,
  Stack,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';
import HourglassTopRoundedIcon from '@mui/icons-material/HourglassTopRounded';
import PlaylistAddCheckRoundedIcon from '@mui/icons-material/PlaylistAddCheckRounded';
import { deleteTask, updateTask, createTask } from '@/services/taskService';

const statusOrder: TaskStatusEnum[] = [
  TaskStatusEnum.Todo,
  TaskStatusEnum.InProgress,
  TaskStatusEnum.Done,
  TaskStatusEnum.Backlog,
];

const statusLabels: Record<TaskStatusEnum, string> = {
  [TaskStatusEnum.Todo]: 'Todo',
  [TaskStatusEnum.InProgress]: 'In Progress',
  [TaskStatusEnum.Backlog]: 'Backlog',
  [TaskStatusEnum.Done]: 'Done',
};

const statusIcons: Record<TaskStatusEnum, React.ReactNode> = {
  [TaskStatusEnum.Todo]: <AssignmentRoundedIcon color="primary" />,
  [TaskStatusEnum.InProgress]: <HourglassTopRoundedIcon color="warning" />,
  [TaskStatusEnum.Backlog]: <PlaylistAddCheckRoundedIcon color="info" />,
  [TaskStatusEnum.Done]: <DoneAllRoundedIcon color="success" />,
};

const assigneeColors: Record<OwnerEnum, string> = {
  Bhargav: '#1976d2',
  Jay: '#9c27b0',
  Shivam: '#2e7d32',
  Sahil: '#ef6c00',
};

export default function TaskList() {
  const [saving, setSaving] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);
  const { tasks, loading, error } = useTasks();
  const [editOpen, setEditOpen] = React.useState(false);
  const [editTask, setEditTask] = React.useState<Task | null>(null);
  const [editValues, setEditValues] = React.useState<Partial<Task>>({});
  const [deleting, setDeleting] = React.useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deleteTargetId, setDeleteTargetId] = React.useState<number | null>(null);
  const [localTasks, setLocalTasks] = React.useState<Task[]>([]);

  React.useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const handleDeleteRequest = (id: number) => {
    setDeleteTargetId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteTargetId !== null) {
      setDeleting(deleteTargetId);
      await deleteTask(deleteTargetId.toString());
      setLocalTasks(localTasks.filter((t) => t.id !== deleteTargetId));
      setDeleting(null);
      setDeleteDialogOpen(false);
      setDeleteTargetId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setDeleteTargetId(null);
  };

  const handleEditOpen = (task: Task) => {
    setEditTask(task);
    setEditValues(task);
    setIsCreating(false);
    setEditOpen(true);
  };

  const handleCreateOpen = () => {
    setEditTask(null);
    setEditValues({
      title: '',
      description: '',
      deadline: undefined,
      assignee: undefined,
      status: undefined,
    });
    setIsCreating(true);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditTask(null);
    setEditValues({});
  };

  const handleEditSave = async () => {
    setSaving(true);
    if (isCreating) {
      const res = await createTask(editValues as Task);
      if (typeof res === 'object' && res !== null && 'id' in res) {
        setLocalTasks([...localTasks, res as Task]);
      }
    } else if (editTask && editTask.id !== undefined) {
      await updateTask(editValues);
      setLocalTasks(localTasks.map((t) => (t.id === editTask.id ? { ...t, ...editValues } : t)));
    }
    setSaving(false);
    handleEditClose();
  };
  const [collapsed, setCollapsed] = React.useState<Record<TaskStatusEnum, boolean>>({
    [TaskStatusEnum.Todo]: false,
    [TaskStatusEnum.InProgress]: false,
    [TaskStatusEnum.Done]: false,
    [TaskStatusEnum.Backlog]: false,
  });

  const handleToggle = (status: TaskStatusEnum) => {
    setCollapsed((prev) => ({ ...prev, [status]: !prev[status] }));
  };

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return <Box sx={{ color: 'error.main', textAlign: 'center', mt: 4 }}>Error loading tasks.</Box>;

  return (
    <>
      <Box sx={{ width: '100%', mx: 'auto', py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button variant="contained" color="primary" onClick={handleCreateOpen}>
            Create New Task
          </Button>
        </Box>
        {statusOrder.map((status) => {
          const filteredTasks = localTasks.filter((task) => task.status === status);
          if (!filteredTasks.length) return null;

          return (
            <Box key={status} sx={{ mb: 6 }}>
              {/* Section Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {statusIcons[status]}
                <Typography variant="h6" sx={{ ml: 1, fontWeight: 'bold', color: 'text.primary' }}>
                  {statusLabels[status]}
                </Typography>
                <Divider sx={{ flexGrow: 1, ml: 2 }} />
                <Chip
                  label={`${filteredTasks.length} task${filteredTasks.length > 1 ? 's' : ''}`}
                  size="small"
                  color="default"
                  sx={{ ml: 2 }}
                />
                <IconButton
                  size="small"
                  onClick={() => handleToggle(status)}
                  sx={{ ml: 1 }}
                  aria-label={collapsed[status] ? 'Expand' : 'Collapse'}
                >
                  {collapsed[status] ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                </IconButton>
              </Box>

              <Collapse in={!collapsed[status]}>
                <Stack spacing={2} sx={{ width: '100%' }}>
                  {filteredTasks.map((task, index) => (
                    <Card
                      key={task.id}
                      variant="outlined"
                      sx={{
                        borderRadius: 3,
                        boxShadow: 2,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        p: 2,
                        gap: 2,
                        width: '100%',
                        transition: 'box-shadow 0.2s',
                        '&:hover': { boxShadow: 6 },
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: assigneeColors[String(task.assignee) as OwnerEnum] || 'grey.500',
                          width: 40,
                          height: 40,
                          fontSize: 18,
                        }}
                      >
                        {task.assignee.charAt(0)}
                      </Avatar>
                      <Box sx={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          sx={{ textAlign: 'left' }}
                        >
                          {task.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textAlign: 'left' }}
                        >
                          {task.description}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          minWidth: 90,
                          ml: 2,
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mb: 0.5, fontWeight: 500 }}
                        >
                          {new Date(task.deadline).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontWeight: 500 }}
                        >
                          {task.assignee}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleEditOpen(task)}
                            aria-label="Edit"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() =>
                              typeof task.id === 'number' ? handleDeleteRequest(task.id) : undefined
                            }
                            aria-label="Delete"
                            disabled={deleting === task.id}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                          <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
                            <DialogTitle>Delete Task</DialogTitle>
                            <DialogContent>
                              <Typography>Are you sure you want to delete this task?</Typography>
                            </DialogContent>
                            <DialogActions>
                              <Button onClick={handleDeleteCancel} disabled={!!deleting}>
                                Cancel
                              </Button>
                              <Button
                                onClick={handleDeleteConfirm}
                                color="error"
                                variant="contained"
                                disabled={!!deleting}
                              >
                                {deleting ? <CircularProgress size={20} /> : 'OK'}
                              </Button>
                            </DialogActions>
                          </Dialog>
                        </Box>
                      </Box>
                    </Card>
                  ))}
                </Stack>
              </Collapse>
            </Box>
          );
        })}
      </Box>
      <Dialog open={editOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle bgcolor="background.paper">Edit Task</DialogTitle>
        <DialogContent sx={{ backgroundColor: 'background.paper' }}>
          <TextField
            margin="dense"
            label="Title"
            sx={{
              '& .MuiInputLabel-outlined': {
                top: '50%',
                transform: 'translate(14px, -50%) scale(1)',
              },
              '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
                top: 0,
                transform: 'translate(14px, -9px) scale(0.75)',
              },
            }}
            fullWidth
            value={editValues.title || ''}
            onChange={(e) => setEditValues((v) => ({ ...v, title: e.target.value }))}
          />
          <TextField
            margin="dense"
            label="Description"
            sx={{
              '& .MuiInputLabel-outlined': {
                top: '50%',
                transform: 'translate(14px, -50%) scale(1)',
              },
              '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
                top: 0,
                transform: 'translate(14px, -9px) scale(0.75)',
              },
            }}
            fullWidth
            value={editValues.description || ''}
            onChange={(e) => setEditValues((v) => ({ ...v, description: e.target.value }))}
          />
          <TextField
            margin="dense"
            label="Deadline"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={
              editValues.deadline ? new Date(editValues.deadline).toISOString().slice(0, 10) : ''
            }
            onChange={(e) =>
              setEditValues((v) => ({
                ...v,
                deadline: e.target.value ? new Date(e.target.value) : undefined,
              }))
            }
          />
          <TextField
            margin="dense"
            select
            fullWidth
            value={editValues.assignee || ''}
            onChange={(e) =>
              setEditValues((v) => ({ ...v, assignee: e.target.value as OwnerEnum }))
            }
            SelectProps={{ native: true }}
          >
            <option value="">Select Assignee</option>
            <option value="Bhargav">Bhargav</option>
            <option value="Jay">Jay</option>
            <option value="Shivam">Shivam</option>
            <option value="Sahil">Sahil</option>
          </TextField>
          <TextField
            margin="dense"
            select
            fullWidth
            value={editValues.status || ''}
            onChange={(e) =>
              setEditValues((v) => ({ ...v, status: e.target.value as TaskStatusEnum }))
            }
            SelectProps={{ native: true }}
          >
            <option value="">Select Status</option>
            <option value="Todo">Todo</option>
            <option value="InProgress">In Progress</option>
            <option value="Done">Done</option>
            <option value="Backlog">Backlog</option>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: 'background.paper' }}>
          <Button onClick={handleEditClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleEditSave} variant="contained" disabled={saving}>
            {saving ? <CircularProgress size={20} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
