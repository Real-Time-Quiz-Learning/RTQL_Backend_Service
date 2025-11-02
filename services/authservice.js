/**
 * The AuthService class has the methods to communicate with the Authentication API.
 */
class AuthService {

    static authEndpoint = "http://64.181.233.131:7766/";

    static signupRoute = "auth/signup";

    static loginRoute = "auth/login";

    static validateTokenRoute = "token/validate";

    static signupErrorMsg = "Error adding new user";

    static loginErrorMsg = "Error logging in user";

    static validateTokenErrorMsg = "Error validating token";

    static async signupUser(userJSON) {
        console.log("AUTHSERVICE userJSON: " + JSON.stringify(userJSON));
        const errorMsg = {
            error: true,
            message: AuthService.signupErrorMsg
        }
        try {
            const response = await fetch(AuthService.authEndpoint + AuthService.signupRoute, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userJSON)
            });

            console.log("AUTHSERVICE response: " + response);

            if (!response.ok) {
                return errorMsg;
            }

            const result = await response.json();

            return result;

        } catch (error) {
            return errorMsg;
        }
    }

    static async loginUser(userJSON){
        console.log(JSON.stringify(userJSON));
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

    static async validateToken(token){
            const errorMsg = {
            error: true,
            message: AuthService.validateTokenErrorMsg
        }

        const bearerString = `Bearer ${token}`

        try {
            const response = await fetch(AuthService.authEndpoint + AuthService.loginRoute, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authentication": bearerString
                }
            });

            console.log("AUTHSERVICE VALIDATETOKEN response: " + JSON.stringify(response));

            if (!response.ok) {
                return errorMsg;
            }

            const result = await response.json();

            return result;

        } catch (error) {
            console.log("ERROR: " + error);
            return errorMsg;
        }
    }

}

export default AuthService;