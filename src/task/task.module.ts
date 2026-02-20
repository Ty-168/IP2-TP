import { Module } from '@nestjs/common';
import { TasksController } from './task.controller';
import { TaskService } from './task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { Task } from './task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), UserModule],
  controllers: [TasksController],
  providers: [TaskService],
  // Add any other necessary configurations or modules
})
export class TaskModule {}