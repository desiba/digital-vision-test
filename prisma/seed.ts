import { Prisma } from '@prisma/client';
import { hash } from '../src/lib/config/password';

export const createUsers = async () => {
  const users: Prisma.UserUpsertArgs['create'][] = [
    {
      id: 676767788998,
      email: "xyz@gmail.com",
      biometricKey: await hash("8976gh6f5sgv8bfs8g"),
      password: await hash('P@ssword01')
    },
  ];

  return users;
};
