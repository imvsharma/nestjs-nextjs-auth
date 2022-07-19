import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  RequestMapping,
  RequestMethod,
  UseGuards,
} from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { LocalAuthGuard } from 'src/guard/local.guard';
import { AuthDTO } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  private readonly logger: Logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @RequestMapping({ path: '/login', method: RequestMethod.POST })
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: AuthDTO) {
    console.log('validate in controller');
    try {
      const { username, password } = body;
      const user = await this.authService.validateUser(username, password);
      if (user.success) {
        const tokenObj = await this.authService.generateToken(user.user);
        return {
          id: user.user.id,
          access_token: tokenObj.access_token,
        };
      } else {
        return user;
      }
    } catch (err) {}
  }

  @MessagePattern({ role: 'auth', cmd: 'check' })
  async loggedIn(data) {
    try {
      const res = this.authService.validateToken(data.jwt);
      return res;
    } catch (err) {
      this.logger.error(`Error in loggedIn ${JSON.stringify(err)}`);
      return false;
    }
  }

  @MessagePattern({ role: 'auth', cmd: 'get' })
  async getTokenInfo(data) {
    try {
      const res = this.authService.getInfoFromToken(data.jwt);
      return res;
    } catch (err) {
      this.logger.error(`Error in getTokenInfo ${JSON.stringify(err)}`);
      Logger.log(err);
      return false;
    }
  }
}
