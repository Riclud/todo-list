import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { OK, ElementCreate } from '../src/core/global.responses';
import { UserModule } from '../src/core/user/user.module';
import { UserService } from '../src/core/user/user.service';
import { TokenModule } from '../src/core/token/token.module';
import { TokenService } from '../src/core/token/token.service';

import { TodoModule } from '../src/components/todo/todo.module';
import { TodoFolderService } from '../src/components/todo/services/todo-folder.service';
import { TodoTaskService } from '../src/components/todo/services/todo-task.service';
import { readFileSync } from 'fs';

describe('Todo', () => {
  let app: INestApplication;
  let access_token: string;
  let userID: string;
  let taskID: string;
  let folderID: string;
  let fileID: string;

  let folderService: TodoFolderService;
  let taskService: TodoTaskService;

  const ok = new OK();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.use(cookieParser());

    const user = await app
      .select(UserModule)
      .get(UserService)
      .create('login@gmail.com', '12345678');

    userID = user.raw[0].id;

    const token = await app
      .select(TokenModule)
      .get(TokenService)
      .create(userID);

    folderService = await app.select(TodoModule).get(TodoFolderService);
    taskService = await app.select(TodoModule).get(TodoTaskService);
    access_token = token.access_token;

    await app.init();
  });

  // FOLDER
  it('/POST CREATE FOLDER', () => {
    const elementCreate = new ElementCreate('Folder');

    return request(app.getHttpServer())
      .post('/todo/folder')
      .set('Authorization', `Bearer ${access_token}`)
      .send({ name: 'Shopping list' })
      .expect(elementCreate.statusCode)
      .then((res) => {
        folderID = res.body.id;
      });
  });

  it('/PUT UPDATE FOLDER ', () => {
    return request(app.getHttpServer())
      .put('/todo/folder')
      .set('Authorization', `Bearer ${access_token}`)
      .send({ folderID, name: 'Goal list' })
      .expect(ok.statusCode)
      .then((res) => expect(res.body).toEqual(ok.getData()));
  });

  it('/GET GET ALL FOLDERS', () => {
    return request(app.getHttpServer())
      .get('/todo/folder')
      .set('Authorization', `Bearer ${access_token}`)
      .send()
      .expect(ok.statusCode)
      .then((res) =>
        expect(res.body.folders[0]).toEqual({
          id: folderID,
          name: 'Goal list',
        }),
      );
  });

  it('/GET GET FOLDER BY ID ', () => {
    return request(app.getHttpServer())
      .get(`/todo/folder/${folderID}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send()
      .expect(ok.statusCode)
      .then((res) =>
        expect(res.body.folder).toEqual({
          id: folderID,
          name: 'Goal list',
          tasks: [],
        }),
      );
  });

  it('/DELETE DELETE FOLDER', () => {
    return request(app.getHttpServer())
      .delete(`/todo/folder/${folderID}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send()
      .expect(ok.statusCode)
      .then((res) => expect(res.body).toEqual(ok.getData()));
  });

  // TASK
  it('/POST CREATE TASK', async () => {
    folderID = (await folderService.create(userID, 'test lsit')).id;

    return request(app.getHttpServer())
      .post('/todo/task')
      .set('Authorization', `Bearer ${access_token}`)
      .send({ name: 'test task', description: 'test description', folderID })
      .expect(ok.statusCode)
      .then((res) => {
        taskID = res.body.id;
      });
  });

  it('/PUT UPDATE TASK', () => {
    return request(app.getHttpServer())
      .put('/todo/task')
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        id: taskID,
        name: 'test task',
        description: 'test description',
        сhecked: true,
      })
      .expect(ok.statusCode)
      .then((res) => expect(res.body).toEqual(ok.getData()));
  });

  it('/GET GET TASK BY ID', () => {
    return request(app.getHttpServer())
      .get(`/todo/task/${taskID}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send()
      .expect(ok.statusCode)
      .then((res) => expect(res.body.data.сhecked).toEqual(true));
  });

  it('/DELETE DELETE TASK', () => {
    return request(app.getHttpServer())
      .delete(`/todo/task/${taskID}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send()
      .expect(ok.statusCode);
  });

  // FILE
  it('/POST CREATE TASK FILE', async () => {
    folderID = (await folderService.create(userID, 'test list')).id;
    taskID = (await taskService.create(userID, { name: 'test task', folderID }))
      .id;

    return request(app.getHttpServer())
      .post(`/task/file/${taskID}`)
      .set('Authorization', `Bearer ${access_token}`)
      .set('Content-Type', 'multipart/form-data')
      .attach(
        'file',
        readFileSync(`${__dirname}/1634769139931.jpeg`),
        '1634769139931.jpeg',
      )
      .expect(ok.statusCode)
      .then((res) => {
        fileID = res.body.id;
      });
  });

  it('/GET GET TASK FILE BY ID', () => {
    return request(app.getHttpServer())
      .get(`/task/file/${fileID}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send()
      .expect(ok.statusCode);
  });

  it('/DELETE DELETE TASK FILE', () => {
    return request(app.getHttpServer())
      .delete(`/task/file/${fileID}`)
      .set('Authorization', `Bearer ${access_token}`)
      .send()
      .expect(ok.statusCode)
      .then((res) => expect(res.body).toEqual(ok.getData()));
  });

  afterAll(async () => {
    await app.select(UserModule).get(UserService).deleteByID(userID);

    await app.close();
  });
});
