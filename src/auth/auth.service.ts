import { ConflictException, ForbiddenException, Injectable } from '@nestjs/common';
import { SignUpInput } from './dto/signup.input';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
import { SignInInput } from './dto/signin.input';
import { BiometricSignInInput } from './dto/biometric-signin.input';
import { comparePasswords, hashPassword } from '../lib/config/password';

@Injectable()
export class AuthService {
 
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService
  ){}

  async signup(signUpInput: SignUpInput) {
    let biometricKey = signUpInput.biometricKey ?? null;
    const checkEmailExist = await this.prisma.user.findUnique({where: {email: signUpInput.email}});
    
    if(checkEmailExist){
      throw new ConflictException('Email already exist');
    }

    const hashedPassword = await hashPassword(signUpInput.password);
    
    if(biometricKey){
      biometricKey = await hashPassword(signUpInput.biometricKey);
    }

    const user = await this.prisma.user.create({ 
      data: { 
        email: signUpInput.email,
        password: hashedPassword,
        biometricKey,
    }});
   
    const { accessToken, refreshToken } = await this.createToken(user.id, user.email);

    await this.updateRefreshToken(user.id, refreshToken);

    return {accessToken, refreshToken, user};
  }

  /*
      Sign in registered users
      parameters 
        - email
        - password
      Response
        - accessToken
        - refreshToken
  */
  async signin(signInInput: SignInInput){
   
    const user = await this.prisma.user.findUnique({
      where: { email: signInInput.email}
    });
   
    if(!user) throw new ForbiddenException('Invalid credentials');

    const doPasswordMatch = await comparePasswords(signInInput.password, user.password);
    
    if(!doPasswordMatch) throw new ForbiddenException("Invalid credentials");

    const { accessToken, refreshToken } = await this.createToken(user.id, user.email);

    await this.updateRefreshToken(user.id, refreshToken);
    
    return { accessToken, refreshToken, user};
  }

  async logout(userId: number) {
    await this.prisma.user.updateMany({
      where: { 
        id: userId,
        refreshToken:{not: null},
      },
      data: { refreshToken: null }
    });

    return { loggedOut: true }
  }

  async biometricLogin(biometricSignInInput: BiometricSignInInput) {
    const hashedBiometricKey = await argon.hash(biometricSignInInput.biometricKey);
 /*
    const user = await this.prisma.user.findUnique({
      where: { biometricKey: hashedBiometricKey}
     });
   
    const {
      accessToken, refreshToken
    } = this.createToken(user.id, user.email)
    */
  }

  private async updateRefreshToken(userId: number, refreshToken: string){
    const hashRefreshToken = await hashPassword(refreshToken);
    await this.prisma.user.update({where: {id: userId}, data: { refreshToken: hashRefreshToken }});
  }

  private async createToken(userId: number, email: string){
    const accessToken = this.jwtService.sign({
      userId,
      email
    },{
      expiresIn: '10s',
      secret: this.configService.get('ACCESS_TOKEN_SECRET')
    });

    const refreshToken = this.jwtService.sign({
      userId,
      email,
      accessToken
    },{
      expiresIn: '7d',
      secret: this.configService.get('REFRESH_TOKEN_SECRET')
    });

    return { accessToken, refreshToken }
  }

}
