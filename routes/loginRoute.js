import express  from 'express';

/**
 * LoginRouter class handles HTTP requests sent to the API at the /login route.
 */
class LoginRouter {
    constructor() {
        this.router = express.Router();
        this.router.use(express.json());
    }

    getRouter() {
        this.loginRoute();
        return this.router;
    }

    loginRoute() {
        this.router.route('/').get((req, res) => {
            res.send('Hello World at the LOGIN route!')
        })
    }
}


export default LoginRouter;