// const express = require('express')
import express from 'express';
import process from 'process';
import cors from 'cors';

import LoginRouter from './routes/loginRoute.js';
import SignupRouter from './routes/signupRoute.js';

/**
 * The server handles everything.
 */
class Server {
  constructor() {
    this.port = process.env.PORT;
    this.app = express();

    this.corsOptions = {
      optionSuccessStatus: 204,
      origin: '*',
      methods: 'GET,PUT,POST,PATCH,DELTE,OPTIONS'
    };

    this.app.use(cors(this.corsOptions));

    this.loginRouter = new LoginRouter();
    this.signupRouter = new SignupRouter();

  }

  start() {
    console.log("Server is started")

    this.app.get('/', (req, res) => {
      res.send('RTQL Backend Server woohoo')
    })

    this.app.use('/login', this.loginRouter.getRouter())

    this.app.use('/signup', this.signupRouter.getRouter())

    // Update this once questionRouter.js is created --> for dealing with question stuff
    this.app.get('/question', (req, res) => {
      res.send('question route woohoo')
    })

    // Update this once responseRouter.js is created --> for dealing with student responses to questions
    this.app.get('/response', (req, res) => {
      res.send('response route woohoo')
    })

    // Update this once roomRouter.js is created --> for dealing with creating a room or whatever
    this.app.get('/room', (req, res) => {
      res.send('room route woohoo')
    })

    this.app.listen(this.port, () => {
      console.log(`Example app listening on port ${this.port}`)
    })
  }
}

const server = new Server();
server.start();