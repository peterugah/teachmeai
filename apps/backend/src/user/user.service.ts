import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '@shared/types';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) { }
  async createUser(user: CreateUserDto) {
    const existingUser = await this.findUser(user);
    if (existingUser) {
      return existingUser;
    }
    return this.databaseService.user.create({
      data: user,
    });
  }

  async findUser(user: CreateUserDto) {
    return this.databaseService.user.findFirst({
      where: user,
    });
  }
}
