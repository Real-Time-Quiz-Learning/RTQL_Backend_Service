import process from 'process';

const POST = "POST";

const GET = "GET";

const PUT = "PUT";

const dbQuestionEndpoint = "/question";

const dbAnswerEndpoint = "/response";


/**
 * The DBService class has the methods needed to communicate with the database API.
 */
class DBService {


    // static dbEndpoint = "http://64.181.233.131:6767/";
    static dbEndpoint = process.env.DB_END;

    static async addNewUser(userJSON) {

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

            if (!response.ok) {
                return errorMsg;
            }

            const result = await response.json();

            return result;

        } catch (error) {

        }
    }

    static async saveQuestion(question, userID) {
        const errorMsg = {
            error: true,
            message: "Error saving question"
        }

        const postBody = {
            pid: userID,
            qtext: question
        }

        try {
            const response = await fetch(DBService.dbEndpoint + dbQuestionEndpoint, {
                method: POST,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(postBody)
            });

            if (!response.ok) {
                return errorMsg;
            }

            const result = await response.json();
            return result;

        } catch (error) {
            console.log("in the catch block :( errorMsg: " + error);
            return errorMsg;
        }
    }

    static async updateQuestion(question, userID, questionID){
       const errorMsg = {
            error: true,
            message: "Error updating question"
        }

        const postBody = {
            pid: userID,
            qtext: question
        }

        try {
            const response = await fetch(DBService.dbEndpoint + dbQuestionEndpoint + "/" + questionID, {
                method: PUT,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(postBody)
            });

            if (!response.ok) {
                return errorMsg;
            }

            const result = await response.json();
            return result;

        } catch (error) {
            console.log("in the catch block :( errorMsg: " + error);
            return errorMsg;
        }


    }

    static async getAllQuestions(userID) {
        const errorMsg = {
            error: true,
            message: "Error adding new user"
        }

        try {
            const response = await fetch(DBService.dbEndpoint + dbQuestionEndpoint + "?pid=" + userID);

            if (!response.ok) {
                return errorMsg;
            }

            const result = await response.json();

            return result;

        } catch (error) {

        }


    }

        static async getAnswers(qid) {
        const errorMsg = {
            error: true,
            message: "Error adding new user"
        }

        try {
            const response = await fetch(DBService.dbEndpoint + dbAnswerEndpoint + "?qid=" + qid);

            if (!response.ok) {
                return errorMsg;
            }

            const result = await response.json();

            return result;

        } catch (error) {

        }


    }


    static async saveAnswer(answer, questionID, correct) {
        const errorMsg = {
            error: true,
            message: "Error adding new user"
        }

        const postBody = {
            qid: questionID,
            rtext: answer,
            correct: correct
        }

        try {
            
            const response = await fetch(DBService.dbEndpoint + dbAnswerEndpoint, {
                method: POST,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(postBody)
            });

            if (!response.ok) {
                return errorMsg;
            }

            const result = await response.json();

            console.log("ANSWER QUESTION RESPONSE FROM DB: " + response);

            return result.response.data.insertId;

        } catch (error) {

        }


    }




}

export default DBService;