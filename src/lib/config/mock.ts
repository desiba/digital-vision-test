export const mockedConfigService = {
    get(key: string) {
      switch (key) {
        case 'security':
          return {
            resetTokenExpiry: '3600',
            jwtSecret: 'secret',
            verificationExpiry: '3600',
            jwtExpiry: '3600',
          };
      }
    },
  };

  export const mockJwtService = {
    sign: jest.fn(),
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  export const prismaMock = {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn().mockReturnThis(),
      create: jest.fn((data) => data),
      updateMany: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis()
    },
  };
  