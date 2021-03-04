import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import { IjwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  singUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    return this.userRepository.singUp(authCredentialsDto);
  }

  async singIn(authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}> {
    const username = await this.userRepository.validateUserPassword(authCredentialsDto);
    
    if(!username)
      throw new UnauthorizedException("Invalid credentials!");

    const payload: IjwtPayload = { username };

    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };

  }
}
