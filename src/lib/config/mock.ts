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