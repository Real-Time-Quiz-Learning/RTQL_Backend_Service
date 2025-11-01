import express  from 'express';
import DBService from '../services/dbService.js';
import AuthService from '../services/authservice.js';

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
        this.router.route('/')
        .get((req, res) => {
            res.send('Hello World at the LOGIN route!')
        })
        .post(async (req, res) => {
            const credentials = req.body;
            if (!credentials.username || !credentials.password){
                res.status(400);
                res.json({
                    message: "A username and password are required for login"
                });
            } else{
                // send to db or to auth?
                res.status(200);
                res.json({
                    message: "You just logged in!",
                    data: "login data idk maybe some sort of token"
                })
            }
        })
        
    }
}


export default LoginRouter;