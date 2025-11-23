import process from 'process';

/**
 * The AuthService class has the methods to communicate with the Authentication API.
 */
class AuthService {

    // static authEndpoint = "http://64.181.233.131:7766/";
    static authEndpoint = process.env.AUTH_END;

    static signupRoute = "/auth/signup";

    static loginRoute = "/auth/login";

    static validateTokenRoute = "/token/validate";

    static signupErrorMsg = "Error adding new user";

    static loginErrorMsg = "Error logging in user";

    static validateTokenErrorMsg = "Error validating token";

    static async signupUser(userJSON) {
        const errorMsg = {
            error: true,
            message: AuthService.signupErrorMsg
        }
        console.log(AuthService.authEndpoint);

        try {
            const response = await fetch(AuthService.authEndpoint + AuthService.signupRoute, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userJSON)
            });

            if (!response.ok) {
                return errorMsg;
            }

            const result = await response.json();

            return result;

        } catch (error) {
            return errorMsg;
        }
    }

    static async loginUser(userJSON) {
        const errorMsg = {
            error: true,
            message: AuthService.loginErrorMsg
        }
        try {
            const response = await fetch(AuthService.authEndpoint + AuthService.loginRoute, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userJSON)
            });

            if (!response.ok) {
                return errorMsg;
            }

            const result = await response.json();

            return result;

        } catch (error) {
            return errorMsg;
        }
    }

    // static async validateToken(token){
    //         const errorMsg = {
    //         error: true,
    //         message: AuthService.validateTokenErrorMsg
    //     }

    //     const bearerString = `Bearer ${token}`

    //     try {
    //         const response = await fetch(AuthService.authEndpoint + AuthService.validateTokenRoute, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "Authorization": bearerString
    //             }
    //         });

    //         if (!response.ok) {
    //             console.log(response);
    //             return errorMsg;
    //         }

    //         const result = await response.json();

    //         return result;

    //     } catch (error) {
    //         return errorMsg;
    //     }
    // 

    // express middleware function to check that the user is authenticated
    static async validateToken(req, res, next) {

        const errorMsg = {
            error: true,
            message: AuthService.validateTokenErrorMsg
        }
        const response = await fetch(AuthService.authEndpoint + AuthService.validateTokenRoute, {
            method: "GET",
            headers: req.headers
        });

        if (!response.ok) {
            console.log(response);
            next(new Error('invalid token'))
        }

        req.validUser = await response.json();

        next();
    }

    // socket.io middleware function to check that the user is authenticated
    static async s_validateToken(socket, next) {
        const errorMsg = {
            error: true,
            message: AuthService.validateTokenErrorMsg
        }

        console.log(socket.handshake.headers);
        if (!socket.handshake.headers['authorization'])
            next(new Error('invalid token'));

        const response = await fetch(AuthService.authEndpoint + AuthService.validateTokenRoute, {
            method: "GET",
            headers: {
                'authorization': socket.handshake.headers['authorization']
            }
        });

        if (!response.ok) {
            console.log(response);
            next(new Error("invalid token"));
        }

        next();
    }
}

export default AuthService;
