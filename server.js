// const express = require('express')
import express from 'express';
import process from 'process';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';

import { QuizRoomService } from './services/quizRoomService.js';

import LoginRouter from './routes/loginRoute.js';
import SignupRouter from './routes/signupRoute.js';
import QuestionRouter from './routes/questionRoute.js';

/**
 * The server handles everything.
 */
class BackendServer {
  constructor() {
    this.port = process.env.PORT;
    this.dbEnd = process.env.DB_END;
    this.authEnd = process.env.AUTH_END;
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = new Server(this.server);

    this.corsOptions = {
      optionSuccessStatus: 204,
      origin: '*',
      methods: 'GET,PUT,POST,PATCH,DELTE,OPTIONS'
    };
    this.app.use(cors(this.corsOptions));

    this.quizRoomService = new QuizRoomService();

    this.loginRouter = new LoginRouter();
    this.signupRouter = new SignupRouter();
    this.questionRouter = new QuestionRouter();
  }

  start() {
    this.app.use(express.static(`${process.cwd()}/public`));

    this.app.use('/login', this.loginRouter.getRouter());

    this.app.use('/signup', this.signupRouter.getRouter());

    this.app.use('/question', this.questionRouter.getRouter());

    // Update this once responseRouter.js is created --> for dealing with student responses to questions
    this.app.get('/response', (req, res) => {
      res.send('response route woohoo')
    })

    // Update this once roomRouter.js is created --> for dealing with creating a room or whatever
    this.app.get('/room', (req, res) => {
      res.send('room route woohoo')
    });

    // Teacher connections 
    // WO: seperate connection type, namespace????
    this.io.on('connection', (socket) => {
        console.log('client connected');

        // Echo
        socket.on('incoming', (msg) => {
          this.io.emit('outgoing', msg);
        });

        // Quiz room initialize
        socket.on('quizRoomCreate', (user) => {
          // WO: this socket should likely use some form of middleware to authenticate the user before actually doing any sort of room creation
          this.io.emit(`${user}, ${socket.id}`);
        });

        socket.on('disconnect', (user, message) => {
            console.log('client disconnected');
            console.log(`client ${user}`);
        });
    });

    // Student connections
    // WO: seperate connection type, namespace? for the student connections

    // START THE LEGENDARY BACKED SERVICE

    this.server.listen(this.port, () => {
      console.log(`RTQL Backend Server listening on port ${this.port}`)
    })
  }
}

const server = new BackendServer();
server.start();