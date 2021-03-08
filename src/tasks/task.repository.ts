import { Req } from '@nestjs/common';
import { userInfo } from 'node:os';
import { GetUser } from 'src/auth/getUser.decorator';
import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTasks(
    filterDto: GetTaskFilterDto,
    user: User,
    ): Promise<Task[]> {
    const { status, search } = filterDto;
    console.log(user.tasks);
    const query = this.createQueryBuilder('task');

    query.where('task.userId = :userId', { userId: user.id });

    if (status) query.andWhere('task.status = :status', { status });
    if (search)
      query.andWhere(
        'task.title LIKE :search OR task.description LIKE :search',
        { search: `%${search}%` },
      );

    const tasks = await query.getMany();
    return tasks;
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    user: User,
    ): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = new Task();
    task.description = description;
    task.title = title;
    task.status = TaskStatus.OPEN;
    task.user = user;
    user.tasks.push(task);  
    await task.save();
    await user.save();

    delete task.user;

    return task;
  }
}
