import { Injectable } from '@nestjs/common';
import { TokenService } from '../../token/token.service';
import { UserService } from '../../user/user.service';
import { JwtHelperService } from './jwt.helper.service';
import { compareSync, hashSync } from 'bcrypt';
import { RestoreCodeService } from './restore-code.service';
import { createTransport } from 'nodemailer';
import { UnauthorizedException } from '../../global.exceptions';
import {
  PasswordMismatchException,
  UserIsAlreadyRegisteredException,
  UserNotFoundException,
} from '../auth.exceptions';

@Injectable()
export class AuthService {
  constructor(
    private jwtHelperService: JwtHelperService,
    private userService: UserService,
    private tokenService: TokenService,
    private restoreCodeService: RestoreCodeService,
  ) {}

  async register(login: string, password: string, accept_password: string) {
    if (password !== accept_password) {
      throw new PasswordMismatchException();
    }

    const user = await this.userService.get('LOGIN', {
      login,
    });

    if (user) {
      throw new UserIsAlreadyRegisteredException();
    }

    const newUser = await this.userService.create(
      login,
      hashSync(password, 10),
    );
    return await this.tokenService.create(newUser.raw[0].id);
  }

  async login(login: string, password: string) {
    const user = await this.userService.get('LOGIN', {
      login,
    });

    if (user && compareSync(password, user.password)) {
      return await this.tokenService.create(user.id);
    } else {
      throw new UserNotFoundException();
    }
  }

  async refresh(refresh_token: string) {
    try {
      if (!refresh_token) {
        throw new UnauthorizedException();
      }

      const { refresh_token_key } = this.jwtHelperService.verify(
        'REFRESH',
        refresh_token,
      );

      const tokenDB = await this.tokenService.get('REFRESH_KEY', {
        refresh_token_key,
      });

      if (!tokenDB) throw new UnauthorizedException();

      await this.tokenService.delete('ID', { id: tokenDB.id });

      return await this.tokenService.create(tokenDB.userID);
    } catch (error) {
      throw error;
    }
  }

  async logout(token: string) {
    return await this.tokenService.delete('ACCESS_TOKEN', {
      refresh_token_key: token,
    });
  }

  async restore(login: string) {
    const user = await this.userService.get('LOGIN', { login });

    if (!user) {
      throw new UserNotFoundException();
    }

    const code = await this.restoreCodeService.create(user.id);

    const transporter = createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.GOOGLE_TEMP_EMAIL,
        pass: process.env.GOOGLE_TEMP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.GOOGLE_TEMP_EMAIL,
      to: login,
      subject: 'Todo list',
      text: `Код для восстановления пароля: ${code}`,
    });
  }

  async restoreAccept(code: string, password: string, accept_password: string) {
    if (password !== accept_password) {
      throw new PasswordMismatchException();
    }

    const checkCode = await this.restoreCodeService.get('CODE', { code });

    if (!checkCode) throw new UnauthorizedException();

    const hashPassword = hashSync(password, 10);

    await this.userService.update(checkCode.userID, { password: hashPassword });
  }

  async delete(userID: string) {
    return await this.userService.deleteByID(userID);
  }
}
