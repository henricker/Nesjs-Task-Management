import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import * as uuid from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private static id = 0;
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilter(getTasksFilterDto: GetTaskFilterDto): Task[] {
    const { status, search } = getTasksFilterDto;
    let tasksSearch = this.getAllTasks();

    if (status)
      tasksSearch = tasksSearch.filter((task) => task.status === status);

    if (search)
      tasksSearch = tasksSearch.filter((task) => {
        task.title.includes(search) || task.description.includes(search);
      });

    return tasksSearch;
  }

  getTaskById(id: string): Task {
    const found = this.tasks.find((task) => task.id === id);

    if (!found) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return found;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid.v1(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  deleteTaskById(id: string): void {
    const found = this.getTaskById(id);
    this.tasks = this.tasks.filter((task) => task.id !== found.id);
  }

  updateStatus(id: string, taskStatus: TaskStatus): Task {
    const task = this.getTaskById(id);
    task.status = taskStatus;
    return task;
  }
}
