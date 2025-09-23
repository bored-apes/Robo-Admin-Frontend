import { OwnerEnum } from './investmentTypes';

export enum TaskStatusEnum {
  Backlog = 'Backlog',
  Todo = 'Todo',
  InProgress = 'InProgress',
  Done = 'Done',
}

export interface Task {
  id?: number;
  title: string;
  description: string;
  deadline: Date;
  assignee: OwnerEnum;
  status: TaskStatusEnum;
}
