import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { SignUpInput } from './dto/signup.input';
import { User } from '../user/user.entity';
import { faker } from '@faker-js/faker';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { mockedConfigService, mockJwtService, prismaMock } from '../lib/config/mock';
import { comparePasswords, hashPassword } from '../lib/config/password';
import { ConflictException, ForbiddenException } from '@nestjs/common';
import { SignInInput } from './dto/signin.input';

jest.mock('../lib/config/password')
describe('AuthService', () => {
  let service: AuthService;
  const accessToken = 'access-token';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        { 
          provide: ConfigService, 
          useValue: mockedConfigService 
        },
        {
          provide: JwtService,
          useValue: mockJwtService
        }
      ],
    })
    .compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("signup", () => {
    it('should sign up user successfully', async () => {
      const loginRequest = {
        email: faker.internet.email(),
        password: faker.internet.password()
      } as SignUpInput;

      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue({
        id: faker.number.int(),
        email: loginRequest.email,
        password: await hashPassword(loginRequest.password)
      });

      jest.spyOn(service as any, 'createToken').mockResolvedValue({});
      (hashPassword as jest.Mock).mockImplementation((password) => password);

      const result = await service.signup(loginRequest);

      expect(result).toBeDefined();
      expect(result).toHaveProperty("accessToken");
      expect(result).toHaveProperty("refreshToken");
      expect(result).toHaveProperty("user");
    });

    it('should throw exception for invalid signup input', async () => {
      const loginRequest = {
        email: 'xyz',
        password: faker.internet.password()
      } as SignUpInput;
      const result = await service.signup(loginRequest);
    });

    it('should throw ConflictException if email already exist', async () => {
      const userEmail = faker.internet.email();

      const loginRequest = {
        email: userEmail
      } as SignUpInput;

      const existingUser = {
        id: faker.number.int(),
        email: userEmail,
        username: faker.person.middleName()
      } as User;

      prismaMock.user.findUnique.mockResolvedValue(existingUser);
      prismaMock.user.create.mockResolvedValue({
        id: faker.number.int()
      });

      await expect(service.signup(loginRequest)).rejects.toThrow(ConflictException);

    });
  })

  describe("signin", () => {
    const email = faker.internet.email()
    const password = faker.internet.password();
    it('should signin user', async () => {

      const loginRequest = {
        email,
        password
      } as SignInInput;

      const existingUser = {
        id: faker.number.int(),
        email,
        username: faker.person.middleName(),
        password,
      } as User;

      const spyOnFindUnique = prismaMock.user.findUnique.mockResolvedValue(existingUser);
      (hashPassword as jest.Mock).mockImplementation((password) => password);
      (comparePasswords as any).mockResolvedValue(true);

      const result = await service.signin(loginRequest);
      expect(result).toBeDefined();
      expect(spyOnFindUnique).toHaveBeenCalledTimes(1);
    })

    it('should throw ForbiddenException with invalid credential', async () => {
      const loginRequest = {} as SignInInput;

      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(service.signin(loginRequest)).rejects.toThrow(ForbiddenException)
    })

    it('should throw ForbiddenException with invalid credential', async () => {
      const loginRequest = {
        email,
        password
      } as SignInInput;

      const existingUser = {
        id: faker.number.int(),
        email,
        username: faker.person.middleName(),
        password,
      } as User;

      prismaMock.user.findUnique.mockResolvedValue(existingUser);
      (hashPassword as jest.Mock).mockImplementation((password) => password);
      (comparePasswords as any).mockResolvedValue(false);
      
      await expect(service.signin(loginRequest)).rejects.toThrow(ForbiddenException)
    })
  })

  describe('updateRefreshToken', () => {
    it('should update refresh token', async () => {
      const userId = faker.number.int();
      const token = '343434343434b34b34b'

      const spyOnUpdate = prismaMock.user.update.mockResolvedValue(null);

      await service['updateRefreshToken'](userId, token);
      expect(spyOnUpdate).toHaveBeenCalled();
    })
  })

  describe('createToken', () => {
    it('should create token', async () => {
      const userId = faker.number.int();
      const token = faker.internet.jwt();

      mockJwtService.sign.mockReturnValue(accessToken);

      const result = await service['createToken'](userId, token);
      
      expect(result).toBeDefined();
      expect(result).toHaveProperty("accessToken")
      expect(result).toHaveProperty("refreshToken")
    })
  })
});
