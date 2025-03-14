import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignUpInput } from './dto/signup.input';
import { UpdateAuthInput } from './dto/update-auth.input';
import { SignResponse } from './dto/sign-response';
import { SignInInput } from './dto/signin.input';
import { Auth } from './entities/auth.entity';
import { LogoutResponse } from './dto/logout-response';
import { BiometricSignInInput } from './dto/biometric-signin.input';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SignResponse)
  signup(@Args('signUpInput') signUpInput: SignUpInput) {
    return this.authService.signup(signUpInput);
  }

  @Mutation(() => SignResponse)
  signin(@Args('signInInput') signInInput: SignInInput) {
    return this.authService.signin(signInInput);
  }

  @Mutation(() => LogoutResponse)
  logout(@Args('id', { type: () => Int }) id: number) {
    return this.authService.logout(id);
  }

  @Mutation(() => SignResponse)
  biometricLogin(@Args('biometricSignInInput') biometricSignInInput: BiometricSignInInput) {
    return this.authService.biometricLogin(biometricSignInInput);
  }

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }
}
