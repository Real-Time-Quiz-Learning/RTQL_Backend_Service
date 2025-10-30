const express = require('express')

class Server {
  constructor() {
    this.port = 3000;
    this.app = express();

  }

  start() {
    console.log("Server is started")

    this.app.get('/', (req, res) => {
      res.send('Hello World!')
    })

    this.app.get('/auth', (req, res) => {
      res.send('auth route woohoo')
    })

    this.app.get('/db', (req, res) => {
      res.send('db route woohoo')
    })

    this.app.get('/model', (req, res) => {
      res.send('model route woohoo')
    })

    this.app.listen(this.port, () => {
      console.log(`Example app listening on port ${this.port}`)
    })
  }
}

const server = new Server();
server.start();