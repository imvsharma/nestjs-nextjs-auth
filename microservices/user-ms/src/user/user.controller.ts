import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  RequestMapping,
  RequestMethod,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IResponse } from './response.interface';
import { CreateUserDTO } from './user.dto';
import { User } from './user.entity';
import { IUser } from './user.interface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  private readonly logger: Logger = new Logger(UserController.name);

  constructor(private userService: UserService) {}

  @RequestMapping({ path: '/', method: RequestMethod.POST })
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() user: CreateUserDTO) {
    try {
      const savedUser = await this.userService.createUser(user);
      this.logger.log(
        `CreateUser :: getting saved user from database :: savedUser : ${JSON.stringify(
          savedUser,
        )}`,
      );
      const response: IResponse = {
        sucess: true,
        message: 'User created successfully',
        user: savedUser,
      };
      return response;
    } catch (err) {
      const response: IResponse = {
        sucess: false,
        message: 'Error in user creation',
        err: err.message,
      };
      return response;
    }
  }

  @RequestMapping({ path: '/', method: RequestMethod.GET })
  @HttpCode(HttpStatus.OK)
  async getUsers() {
    try {
      const userList: IUser[] = await this.userService.getUsers();
      const response: IResponse = {
        sucess: true,
        message: 'Users fetched successfully',
        users: userList,
      };
      return response;
    } catch (err) {
      const response: IResponse = {
        sucess: false,
        message: 'Error in users fetching',
        err: err.message,
      };
      return response;
    }
  }

  @RequestMapping({ path: '/:id', method: RequestMethod.GET })
  @HttpCode(HttpStatus.OK)
  async getUser(@Param() id: string) {
    try {
      const user: User = await this.userService.getUser(id);
      const response: IResponse = {
        sucess: true,
        message: 'User fetched successfully',
        user: user,
      };
      return response;
    } catch (err) {
      const response: IResponse = {
        sucess: false,
        message: 'Error in user fetching',
        err: err.message,
      };
      return response;
    }
  }

  @RequestMapping({ path: '/:id', method: RequestMethod.PATCH })
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id') id: string,
    @Body() userDetails: Partial<CreateUserDTO>,
  ) {
    try {
      const user: User = await this.userService.updateUser(id, userDetails);
      const response: IResponse = {
        sucess: true,
        message: 'User updated successfully',
        user: user,
      };
      return response;
    } catch (err) {
      console.log(err);
      const response: IResponse = {
        sucess: false,
        message: 'Error in user updation',
        err: err.message,
      };
      return response;
    }
  }

  @RequestMapping({ path: '/:id', method: RequestMethod.DELETE })
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('id') id: string) {
    try {
      await this.userService.deleteUser(id);
      const response: IResponse = {
        sucess: true,
        message: 'User deleted successfully',
      };
      return response;
    } catch (err) {
      console.log(err);
      const response: IResponse = {
        sucess: false,
        message: 'Error in user deletion',
        err: err.message,
      };
      return response;
    }
  }

  @MessagePattern({ role: 'user', cmd: 'get' })
  async validateUser(userDetails: {
    username: string;
    password: string;
  }): Promise<User | null | any> {
    this.logger.log(
      `ValidateUser :: getting userDetails from auth service ::   ${JSON.stringify(
        userDetails,
      )}`,
    );
    const user: User | null | any = this.userService.validateUser(
      userDetails.username,
      userDetails.password,
    );

    return user;
  }
}
