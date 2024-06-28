import * as bcrypt from 'bcrypt';

const SALT = 10;

export const encodePassword = (rawPassword: string) => {
  return bcrypt.hash(rawPassword, SALT);
};
