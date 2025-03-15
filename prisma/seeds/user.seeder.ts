import { Prisma } from '@prisma/client';
import { hash } from '../../src/lib/config/password';

export const createUsers = async () => {
  const users: Prisma.UserUpsertArgs['create'][] = [
    {
        id: 34335353,
        email: "xyz@gmail.com",
        biometricKey: 'U2FsdGVkX18n9SzWzj2SpNVGgjWtHlsvm0JLzemHu1Y=',
        password: await hash('P@ssword01')
    }
  ];

  return users;
};