import * as bcrypt from 'bcrypt';

export const hash = async (password: string) => {
    const  saltRounds  = Number(process.env.SALT_ROUNDS) || 10;
    return bcrypt.hash(password, saltRounds);
  };
  
  export const compare = (
    plainPassword: string,
    hashedPassword: string,
  ) => {
    return bcrypt.compare(plainPassword, hashedPassword);
  };