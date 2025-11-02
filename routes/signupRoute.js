import express from 'express';
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

                // Go through auth signup request
                const authSignupResponse = await AuthService.signupUser(newUser);

                if (authSignupResponse.error){
                                        res.status(400);
                    res.json({
                        message: authSignupResponse.message
                    })
                    return;

                }

                // Get the auth token from the response
                const token = authSignupResponse.response.data.token;

                // is this correct??
                if (authSignupResponse.error) {
                    res.status(400);
                    res.json({
                        message: authSignupResponse.message
                    })
                } else {
                    res.status(200);
                    res.json({
                        message: authSignupResponse.message,
                        token: token
                    })
                }
            })
    }
}


export default SignupRouter;