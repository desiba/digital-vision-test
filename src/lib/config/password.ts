import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string) => {
    const  saltRounds  = Number(process.env.SALT_ROUNDS) || 10;
    return bcrypt.hash(password, saltRounds);
  };
  
  export const comparePasswords = (
    plainPassword: string,
    hashedPassword: string,
  ) => {
    return bcrypt.compare(plainPassword, hashedPassword);
  };