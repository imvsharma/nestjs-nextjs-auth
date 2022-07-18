import { IUser } from './user.interface';

export interface IResponse {
  sucess: boolean;
  message: string;
  user?: IUser | null;
  users?: IUser[] | null;
  err?: string;
}
