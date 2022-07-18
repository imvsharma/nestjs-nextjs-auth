import * as uuid from 'uuid';
import * as bcrypt from 'bcryptjs';

const SALT = 10;

export const generateUUID = () => {
  return uuid.v4();
};

export const hashedPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT);
};

export const isMatch = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};
