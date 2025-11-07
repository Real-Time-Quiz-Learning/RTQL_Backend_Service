import process from 'process';

const POST = "POST";

/**
 * The DBService class has the methods needed to communicate with the database API.
 */
class DBService {


    // static dbEndpoint = "http://64.181.233.131:6767/";
    static dbEndpoint = process.env.DB_END;

    static async addNewUser(userJSON) {

        console.log(DBService.dbEndpoint);

        const errorMsg = {
            error: true,
            message: "Error adding new user"
        }

        try {
            const response = await fetch(DBService.dbEndpoint, {
                method: POST,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userJSON)
            });

            if (!response.ok){
                return errorMsg;
            }

            const result = await response.json();

            return result;
            
        } catch (error){

        }
    }




    static checkExistingUser() {

    }

}

export default DBService;