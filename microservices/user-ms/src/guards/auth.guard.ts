import {
  CanActivate,
  Inject,
  ExecutionContext,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';

export class AuthGuard implements CanActivate {
  logger: Logger = new Logger(AuthGuard.name);
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly client: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      return lastValueFrom(
        this.client
          .send(
            { role: 'auth', cmd: 'check' },
            { jwt: req.headers['authorization']?.split(' ')[1] },
          )
          .pipe(timeout(5000)),
      ).then((res) => {
        if (!res) {
          throw new UnauthorizedException();
        }
        return res;
      });
    } catch (err) {
      this.logger.error(`Error in AuthGuard :: ${err}`);
      return false;
    }
  }
}
