import * as bcrypt from 'bcrypt';

const SALT = 10;

export const encodePassword = (rawPassword: string) => {
  return bcrypt.hash(rawPassword, SALT);
};

export const decodePassword = (rawPassword: string, hash: string) => {
  return bcrypt.compare(rawPassword, hash);
};
