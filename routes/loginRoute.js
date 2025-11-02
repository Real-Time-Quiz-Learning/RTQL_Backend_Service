import express from 'express';
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

                console.log("AUTH LOGIN credentials: " + JSON.stringify(credentials));

                if (!credentials.email || !credentials.pass) {
                    res.status(400);
                    res.json({
                        message: "An email and password are required for login"
                    });
                } else {


                    const authLoginResponse = await AuthService.loginUser(credentials);

                    if (authLoginResponse.error) {
                        res.status(400);
                        res.json({
                            message: authLoginResponse.message
                        })
                        return;

                    }

                    console.log("LOGIN RESPonse: " + JSON.stringify(authLoginResponse));

                    const token = authLoginResponse.response.data.token;

                    console.log("LOGIN TOKEN: " + token);

                    res.status(200);
                    res.json({
                        message: "Login success!",
                        token: token
                    })
                }
            })

    }
}


export default LoginRouter;