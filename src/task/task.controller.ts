import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TaskService } from './task.service';


@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TaskService) {}

  @Get(':id')
  getTask(@Param('id') id: number) {
    return this.taskService.findOne(id);
  }
  @Post('create')
  createTask(@Body() body: any) {
    return this.taskService.create(body);
  }

  @Patch('/:id/done')
  markTaskAsDone(@Body() body: any, @Param('id') id: number) {
    return this.taskService.update(id, { ...body, isDone: true });
  }

  @Patch('/:id/pending')
  markTaskAsPending(@Body() body: any, @Param('id') id: number) {
    return this.taskService.update(id, { ...body, isDone: false });
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: number) {
    return this.taskService.remove(id);
  }
}