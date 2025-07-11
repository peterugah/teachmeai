import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ZodValidationPipe } from 'src/shared/pipes/zod.pipe';
import { CreateUserDto } from '@shared/types';
import { createUserValidator } from './user.validator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  addUser(
    @Body(new ZodValidationPipe(createUserValidator)) user: CreateUserDto,
  ) {
    return this.userService.createUser(user);
  }
}
