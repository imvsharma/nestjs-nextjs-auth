import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './user.dto';
import { User } from './user.entity';
import { generateUUID, hashedPassword } from './user.helper';
@Injectable()
export class UserService {
  private logger: Logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(userDetails: CreateUserDTO): Promise<User> {
    const body: CreateUserDTO = userDetails;
    const user: User = {
      ...body,
      id: generateUUID(),
      password: await hashedPassword(body.password),
      createdAt: new Date(),
    };

    return await this.userRepository.save(user);
  }

  async getUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async getUser(id: string): Promise<User> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = id', { id })
      .getOne();
  }

  async updateUser(id: string, data: Partial<CreateUserDTO>): Promise<any> {
    await this.userRepository
      .createQueryBuilder('user')
      .update()
      .where('id = id', { id })
      .set(data)
      .execute();

    return await this.getUser(id);
  }

  async deleteUser(id: string): Promise<any> {
    return await this.userRepository
      .createQueryBuilder('user')
      .delete()
      .where('id = id', { id })
      .execute();
  }
}
