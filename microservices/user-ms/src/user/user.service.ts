import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom, timeout } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './user.dto';
import { User } from './user.entity';
import { generateUUID, hashedPassword, isMatch } from './user.helper';
@Injectable()
export class UserService {
  private logger: Logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject('AUTH_SERVICE') private authClient: ClientProxy,
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

  async validateUser(
    username: string,
    password: string,
  ): Promise<User | null | any> {
    const user = await this.userRepository.findOne({
      where: { username: username },
    });

    this.logger.log(
      `validateUser :: get details from user controller :: userDetails : ${JSON.stringify(
        user,
      )}`,
    );

    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    } else {
      const isMatched = await isMatch(password, user.password);
      if (isMatched) {
        return {
          success: true,
          message: 'User found',
          user: user,
        };
      } else {
        return {
          success: false,
          message: 'Password is incorrect',
        };
      }
    }
  }

  async getTokenInfo(token) {
    return lastValueFrom(
      this.authClient
        .send({ role: 'auth', cmd: 'get' }, { jwt: token?.split(' ')[1] })
        .pipe(timeout(5000)),
    );
  }
}
