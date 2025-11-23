import process from 'process';

const POST = "POST";

const GET = "GET";

const PUT = "PUT";

const DELETE = "DELETE";

const dbQuestionEndpoint = "/question";

const dbAnswerEndpoint = "/response";

const errorAddingUserMsg = "Error adding new user";

const errorSavingQuestionMsg = "Error saving question";

const errorUpdatingQuestionMsg = "Error updating question";

const errorDeletingQuestionMsg = "Error deleting question";

const errorGettingAnswerMsg = "Error getting answer";

const errorGettingQuestionsMsg = "Error getting questions";

const errorSavingAnswerMsg = "Error saving answer";

const errorUpdatingAnswerMsg = "Error updating answer";

const errorDeletingAnswerMsg = "Error deleting answer";


/**
 * The DBService class has the methods needed to communicate with the database API.
 */
class DBService {

    static dbEndpoint = process.env.DB_END;

    static async addNewUser(userJSON) {

        const errorMsg = {
            error: true,
            message: errorAddingUserMsg
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
            message: errorSavingQuestionMsg
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

    static async updateQuestion(question, userID, questionID) {
        const errorMsg = {
            error: true,
            message: errorUpdatingQuestionMsg
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

    static async deleteQuestion(questionID) {
        const errorMsg = {
            error: true,
            message: errorDeletingQuestionMsg
        }

        try {
            const response = await fetch(DBService.dbEndpoint + dbQuestionEndpoint + "/" + questionID, {
                method: DELETE,
                headers: {
                    "Content-Type": "application/json"
                }
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
            message: errorGettingQuestionsMsg
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
            message: errorGettingAnswerMsg
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
            message: errorSavingAnswerMsg
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

    static async updateResponse(response, responseID, correct) {
        const errorMsg = {
            error: true,
            message: errorUpdatingAnswerMsg
        }

        const postBody = {
            rtext: response,
            correct: correct
        }

        try {
            const response = await fetch(DBService.dbEndpoint + dbAnswerEndpoint + "/" + responseID, {
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


    static async deleteResponse(responseID) {
        const errorMsg = {
            error: true,
            message: errorDeletingAnswerMsg
        }

        try {
            const response = await fetch(DBService.dbEndpoint + dbAnswerEndpoint + "/" + responseID, {
                method: DELETE,
                headers: {
                    "Content-Type": "application/json"
                }
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




}

export default DBService;