import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import {
  CreateUserDto,
  RestoreAcceptDto,
  RestoreUserDto,
  LoginUserDto,
} from './user.dto';
import { Response } from 'express';
import { Public } from './decorators/public.decorator';
import { Token } from './decorators/token.decorator';
import { User } from './decorators/user.decorator';
import { jwtPayloadType } from './types/jwt-payload.type';
import { OK } from '../global.responses';
import { AuthOK } from './auth.responses';
import {
  UnauthorizedException,
  BadRequestException,
} from '../global.exceptions';
import {
  ApiTags,
  ApiBody,
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private setRefreshToken(token: string, res: Response) {
    res.cookie('refresh_token', token, { httpOnly: true });
  }

  private deleteRefreshToken(res: Response) {
    res.clearCookie('refresh_token');
  }

  @Get('check')
  @ApiOperation({ summary: 'Access token check' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: OK })
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  check() {
    return new OK();
  }

  @Post('register')
  @HttpCode(200)
  @Public()
  @ApiOperation({ summary: 'Register user' })
  @ApiBody({ type: CreateUserDto })
  @ApiOkResponse({ type: AuthOK })
  @ApiResponse({ type: BadRequestException, status: HttpStatus.BAD_REQUEST })
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  async register(
    @Res({ passthrough: true }) res: Response,
    @Body() createUserDto: CreateUserDto,
  ) {
    const { login, password, accept_password } = createUserDto;

    const { access_token, refresh_token } = await this.authService.register(
      login,
      password,
      accept_password,
    );

    this.setRefreshToken(refresh_token, res);

    return new AuthOK(access_token);
  }

  @Post('login')
  @HttpCode(200)
  @Public()
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginUserDto })
  @ApiOkResponse({ type: AuthOK })
  @ApiResponse({ type: BadRequestException, status: HttpStatus.BAD_REQUEST })
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginUserDto: LoginUserDto,
  ) {
    const { login, password } = loginUserDto;

    const { access_token, refresh_token } = await this.authService.login(
      login,
      password,
    );

    this.setRefreshToken(refresh_token, res);

    return new AuthOK(access_token);
  }

  @Get('refresh')
  @HttpCode(200)
  @Public()
  @ApiOperation({ summary: 'Refresh user token' })
  @ApiOkResponse({ type: AuthOK })
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  async refresh(
    @Res({ passthrough: true }) res: Response,
    @Token('REFRESH') token: string,
  ) {
    const { access_token, refresh_token } = await this.authService.refresh(
      token,
    );

    this.setRefreshToken(refresh_token, res);

    return new AuthOK(access_token);
  }

  @Get('logout')
  @ApiOperation({ summary: 'Logout user' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: OK })
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  async logout(
    @Res({ passthrough: true }) res: Response,
    @Token('ACCESS') token: string,
  ) {
    await this.authService.logout(token);
    this.deleteRefreshToken(res);
    return new OK();
  }

  @Post('restore')
  @HttpCode(200)
  @Public()
  @ApiOperation({ summary: 'Restore user password' })
  @ApiBody({ type: RestoreUserDto })
  @ApiOkResponse({ type: OK })
  @ApiResponse({ type: BadRequestException, status: HttpStatus.BAD_REQUEST })
  async restore(@Body() restoreUserDto: RestoreUserDto) {
    const { login } = restoreUserDto;

    await this.authService.restore(login);

    return new OK();
  }

  @Post('restore-accept')
  @HttpCode(200)
  @Public()
  @ApiOperation({ summary: 'Restore accept user password' })
  @ApiBody({ type: RestoreAcceptDto })
  @ApiOkResponse({ type: OK })
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  async restoreAccept(@Body() restoreAcceptDto: RestoreAcceptDto) {
    const { code, password, accept_password } = restoreAcceptDto;

    await this.authService.restoreAccept(code, password, accept_password);
    return new OK();
  }

  @Delete('delete')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete user account' })
  @ApiBearerAuth()
  @ApiOkResponse({ type: OK })
  @ApiUnauthorizedResponse({ type: UnauthorizedException })
  async delete(@User() user: jwtPayloadType) {
    /*
    Для работы этого эндпоинта требуется реализовать
    проверку токена на наличие в базе при каждом запросе
    или проверку токена в чёрном списке.
    */
    await this.authService.delete(user.id);
    return new OK();
  }
}
