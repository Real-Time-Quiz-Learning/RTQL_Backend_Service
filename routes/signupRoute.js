import express  from 'express';
import DBService from '../services/dbService.js';
import AuthService from '../services/authservice.js';

/**
 * SignupRouter class handles HTTP requests sent to the API at the /signup route.
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
        this.router.route('/')
        .get((req, res) => {
            res.send('Hello World at the SIGNUP route!')
        })
        .post(async (req, res) => {
            const newUser = req.body;
        
            // I guess just send to the database or to auth??
            // idk if i need to verify the parameters since the db is anyways? so do I just pass the response through?
            const response = "you signed up, congrats";
             res.status(200);
             res.json({
                message: response
             })
        })
    }
}


export default SignupRouter;