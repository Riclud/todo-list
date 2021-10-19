import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokenModule } from '../token/token.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { JwtHelperService } from './services/jwt.helper.service';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestoreCodeEntity } from './restore-code.entity';
import { RestoreCodeService } from './services/restore-code.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET_KEY,
      signOptions: { expiresIn: process.env.JWT_ACCESS_SECRET_TIME },
    }),
    UserModule,
    forwardRef(() => TokenModule),
    TypeOrmModule.forFeature([RestoreCodeEntity]),
  ],
  controllers: [AuthController],
  providers: [JwtHelperService, AuthService, RestoreCodeService, JwtStrategy],
  exports: [JwtHelperService],
})
export class AuthModule {}
