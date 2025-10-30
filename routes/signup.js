import express  from 'express';

/**
 * SignupRouter class handles HTTP requests sent to the API at the /login route.
 */
class SignupRouter {
    constructor() {
        this.router = express.Router();
        this.router.use(express.json());
    }

    getRouter() {
        this.signupRoute();
        return this.router;
    }

    signupRoute() {
        this.router.route('/').get((req, res) => {
            res.send('Hello World at the SIGNUP route!')
        })
    }
}


export default SignupRouter;