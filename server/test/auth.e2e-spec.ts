import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import {
  PasswordMismatchException,
  UserNotFoundException,
  UserIsAlreadyRegisteredException,
} from '../src/core/auth/auth.exceptions';
import { AuthOK } from '../src/core/auth/auth.responses';
import { UnauthorizedException } from '../src/core/global.exceptions';
import { OK } from '../src/core/global.responses';
import { AuthModule } from '../src/core/auth/auth.module';
import { RestoreCodeService } from '../src/core/auth/services/restore-code.service';
import { UserModule } from '../src/core/user/user.module';
import { UserService } from '../src/core/user/user.service';

describe('Auth', () => {
  let app: INestApplication;
  const login = 'riclud@mail.ru';
  const password = '12345678';
  const newPassword = 'a12345678a';
  let access_token = null;
  let cookie = null;

  const authOK = new AuthOK('token');
  const ok = new OK();

  const userIsAlreadyRegisteredException =
    new UserIsAlreadyRegisteredException();
  const passwordMismatchException = new PasswordMismatchException();
  const unauthorizedException = new UnauthorizedException();
  const userNotFoundException = new UserNotFoundException();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.use(cookieParser());

    await app.init();
  });

  it('/POST REGISTER USER (PASSWORD MISMATCH)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .set('Content-type', 'application/json')
      .send({ login, password, accept_password: 'invalidPassord' })
      .expect(passwordMismatchException.statusCode)
      .then((res) => {
        expect(res.body).toEqual(passwordMismatchException.getData());
      });
  });

  it('/POST REGISTER USER', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .set('Content-type', 'application/json')
      .send({ login, password, accept_password: password })
      .expect(authOK.statusCode)
      .then((res) => {
        expect(res.body).toMatchObject({ statusCode: authOK.statusCode });
        expect(res.body).toHaveProperty('access_token');

        access_token = res.body.access_token;
      });
  });

  it('/POST REGISTER USER (IS ALREADY REGISTERED)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .set('Content-type', 'application/json')
      .send({ login, password, accept_password: password })
      .expect(userIsAlreadyRegisteredException.statusCode)
      .then((res) => {
        expect(res.body).toEqual(userIsAlreadyRegisteredException.getData());
      });
  });

  it('/GET LOGOUT USER', () => {
    return request(app.getHttpServer())
      .get('/auth/logout')
      .set('Authorization', `Bearer ${access_token}`)
      .send()
      .expect(ok.statusCode)
      .then((res) => expect(res.body).toEqual(ok.getData()));
  });

  it('/GET LOGOUT USER (INVALID ACCESS)', () => {
    return request(app.getHttpServer())
      .get('/auth/logout')
      .send()
      .expect(unauthorizedException.statusCode)
      .then((res) => expect(res.body).toEqual(unauthorizedException.getData()));
  });

  it('/POST RESTORE USER PASSWORD', () => {
    return request(app.getHttpServer())
      .post('/auth/restore')
      .set('Content-type', 'application/json')
      .send({ login })
      .expect(ok.statusCode)
      .then((res) => expect(res.body).toEqual(ok.getData()));
  });

  it('/POST RESTORE USER PASSWORD (INVALID LOGIN|EMAIL)', () => {
    return request(app.getHttpServer())
      .post('/auth/restore')
      .set('Content-type', 'application/json')
      .send({ login: 'invalidLogin@gmail.com' })
      .expect(userNotFoundException.statusCode)
      .then((res) => expect(res.body).toEqual(userNotFoundException.getData()));
  });

  it('/POST RESTORE USER PASSWORD ACCEPT CODE', async () => {
    const user = await app
      .select(UserModule)
      .get(UserService)
      .get('LOGIN', { login });

    const { code } = await app
      .select(AuthModule)
      .get(RestoreCodeService)
      .get('USER_ID', { userID: user.id });

    return request(app.getHttpServer())
      .post('/auth/restore-accept')
      .set('Content-type', 'application/json')
      .send({ code, password: newPassword, accept_password: newPassword })
      .expect(ok.statusCode)
      .then((res) => expect(res.body).toEqual(ok.getData()));
  });

  it('/POST RESTORE USER PASSWORD ACCEPT (INVALID CODE)', () => {
    return request(app.getHttpServer())
      .post('/auth/restore-accept')
      .set('Content-type', 'application/json')
      .send({ code: 1, password: newPassword, accept_password: newPassword })
      .expect(unauthorizedException.statusCode)
      .then((res) => expect(res.body).toEqual(unauthorizedException.getData()));
  });

  it('/POST AUTH LOGIN', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .set('Content-type', 'application/json')
      .send({ login, password: newPassword })
      .expect(authOK.statusCode)
      .then((res) => {
        expect(res.body).toMatchObject({ statusCode: authOK.statusCode });
        expect(res.body).toHaveProperty('access_token');

        cookie = res.headers['set-cookie'];
      });
  });

  it('/POST AUTH LOGIN (WRONG PASSWORD)', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .set('Content-type', 'application/json')
      .send({ login: 'invalidLogin@gmail.com', password: 'invalidPassword' })
      .expect(userNotFoundException.statusCode)
      .then((res) => expect(res.body).toEqual(userNotFoundException.getData()));
  });

  it('/GET REFRESH USER TOKEN', () => {
    return request(app.getHttpServer())
      .get('/auth/refresh')
      .set('Cookie', cookie)
      .send()
      .expect(authOK.statusCode)
      .then((res) => {
        expect(res.body).toMatchObject({ statusCode: authOK.statusCode });
        expect(res.body).toHaveProperty('access_token');

        access_token = res.body.access_token;
      });
  });

  it('/GET REFRESH USER (ACCESS INVALID)', () => {
    return request(app.getHttpServer())
      .get('/auth/refresh')
      .send()
      .expect(unauthorizedException.statusCode)
      .then((res) => expect(res.body).toEqual(unauthorizedException.getData()));
  });

  it('/GET CHECK TOKEN', () => {
    return request(app.getHttpServer())
      .get('/auth/logout')
      .set('Authorization', `Bearer ${access_token}`)
      .expect(ok.statusCode)
      .then((res) => expect(res.body).toEqual(ok.getData()));
  });

  it('/GET CHECK TOKEN (ACCESS INVALID)', () => {
    return request(app.getHttpServer())
      .get('/auth/logout')
      .expect(unauthorizedException.statusCode)
      .then((res) => expect(res.body).toEqual(unauthorizedException.getData()));
  });

  it('/DELETE DELETE USER ACCOUNT', () => {
    return request(app.getHttpServer())
      .delete('/auth/delete')
      .set('Authorization', `Bearer ${access_token}`)
      .expect(ok.statusCode)
      .then((res) => expect(res.body).toEqual(ok.getData()));
  });

  it('/DELETE DELETE USER ACCOUNT (ACCESS INVALID)', () => {
    return request(app.getHttpServer())
      .delete('/auth/delete')
      .expect(unauthorizedException.statusCode)
      .then((res) => expect(res.body).toEqual(unauthorizedException.getData()));
  });

  afterAll(async () => {
    await app.close();
  });
});
