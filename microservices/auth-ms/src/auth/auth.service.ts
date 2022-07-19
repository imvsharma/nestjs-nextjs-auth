import {
  Inject,
  Injectable,
  Logger,
  RequestTimeoutException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import {
  catchError,
  lastValueFrom,
  throwError,
  TimeoutError,
  timeout,
  Observable,
} from 'rxjs';

@Injectable()
export class AuthService {
  private logger: Logger = new Logger(AuthService.name);
  constructor(
    @Inject('USER_SERVICE') private userClient: ClientProxy,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    return lastValueFrom(
      this.userClient
        .send(
          { role: 'user', cmd: 'get' },
          { username: username, password: password },
        )
        .pipe(
          timeout(5000),
          catchError((err) => {
            if (err instanceof TimeoutError) {
              return throwError(new RequestTimeoutException());
            }
            return throwError(err);
          }),
        ),
    );
  }

  async generateToken(user) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  validateToken(token: string) {
    return this.jwtService.verify(token);
  }

  getInfoFromToken(token: string) {
    if (this.jwtService.verify(token)) {
      return this.jwtService.decode(token);
    }
  }
}
