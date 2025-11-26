// const express = require('express')
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json' with { type: 'json' };
import process from 'process';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';

import { QuizRoomService } from './services/quizRoomService.js';
import { AdminService } from './services/adminService.js';
import AuthService from './services/authservice.js';

import { TeacherSocket } from './sockets/teacherSocket.js';
import { StudentSocket } from './sockets/studentSocket.js';

import LoginRouter from './routes/loginRoute.js';
import SignupRouter from './routes/signupRoute.js';
import QuestionRouter from './routes/questionRoute.js';
import { AdminRouter } from './routes/adminRoute.js';
import { ModelRouter } from './routes/modelRoute.js';

/**
 * The server handles everything.
 */
class BackendServer {
  static teacherSocketNamespace = '/teacher';
  static studentSocketNamespace = '/student';

  constructor() {
    this.port = process.env.PORT;
    this.dbEnd = process.env.DB_END;
    this.authEnd = process.env.AUTH_END;
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = new Server(this.server, {
      cors: {
        origin: '*',
        methods: [ 'GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS' ],
        allowedHeaders: [ "Authorization", "authorization" ]
      }
    });

    this.corsOptions = {
      optionSuccessStatus: 204,
      origin: '*',
      methods: 'GET,PUT,POST,PATCH,DELETE,OPTIONS'
    };
    this.app.use(cors(this.corsOptions));

    this.adminService = new AdminService();
    this.quizRoomService = new QuizRoomService();

    // Socket namespaces
    this.teacher = this.io.of(BackendServer.teacherSocketNamespace);
    this.student = this.io.of(BackendServer.studentSocketNamespace);

    // HTTP routes
    this.loginRouter = new LoginRouter();
    this.signupRouter = new SignupRouter();
    this.questionRouter = new QuestionRouter();

    // Sockets handlers
    this.teacherSocket = new TeacherSocket(this.teacher, this.student, this.quizRoomService);
    this.studentSocket = new StudentSocket(this.student, this.teacher, this.quizRoomService);

    this.b_serviceMiddleware = this.serviceMiddleware.bind(this);
  }

  serviceMiddleware(req, res, next) {
    req.services = Object.freeze({
      adminService: this.adminService
    });

    next();
  }

  start() {
    this.app.use(express.static(`${process.cwd()}/public`));

    this.app.use(this.b_serviceMiddleware);

    this.app.use('/login', this.adminService.b_apiStatsMiddleware, this.loginRouter.getRouter());
    this.app.use('/signup', this.adminService.b_apiStatsMiddleware, this.signupRouter.getRouter());
    this.app.use('/model', AuthService.validateToken, this.adminService.b_apiStatsMiddleware, ModelRouter);
    this.app.use('/question', AuthService.validateToken, this.adminService.b_apiStatsMiddleware, this.questionRouter.getRouter());
    this.app.use('/admin', AuthService.validateToken, AdminRouter);

    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    // Update this once responseRouter.js is created --> for dealing with student responses to questions
    this.app.get('/response', (req, res) => {
      res.send('response route woohoo')
    });

    // Update this once roomRouter.js is created --> for dealing with creating a room or whatever
    this.app.get('/room', (req, res) => {
      res.send('room route woohoo')
    });

    // Register sockets
    this.teacher.use(AuthService.s_validateToken);
    this.teacher.on("connection", (socket) => {
      this.teacherSocket.registerHandlers(socket);
    });

    this.student.on("connection", (socket) => {
      this.studentSocket.registerHandlers(socket);
    });

    this.server.listen(this.port, () => {
      console.log(`RTQL Backend Server listening on port ${this.port}`)
    });
  }
}

const server = new BackendServer();
server.start();
