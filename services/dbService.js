import process from 'process';
import { URLSearchParams } from 'url';

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

    /**
     * Transforms a question entity into the expected model format (with the responses basically).
     * 
     * @param {*} question question which we shall enhance to the model
     * @returns 
     */
    static async _mapQuestionEntityToModel(question) {
        if (!question.id)
            throw new Error('question requires id property');
        if (!question.qtext)
            throw new Error('question requires qtext property');
        if (!question.pid)
            throw new Error('question requires pid property');

        // retrieve responses
        const url = new URL([DBService.dbEndpoint, 'response'].join('/'));
        url.searchParams.append('qid', question.id);

        // console.log(url.href);

        const resp = await fetch(url);
        const respJson = await resp.json();

        // Bad response or the response was undefined
        if (!resp.ok)
            throw new Error('error retrieving responses for question');
        if (respJson.response === undefined || respJson.response.data === undefined)
            throw new Error('no responses for such a question');
        
        question.responses = respJson.response.data;

        console.log(JSON.stringify(question));

        return question;
    }


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
            const url = new URL([DBService.dbEndpoint, 'question'].join('/'));
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
            const url = new URL([DBService.dbEndpoint, 'question', questionID].join('/'));
            const response = await fetch(url, {
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
            const url = new URL([DBService.dbEndpoint, 'question', questionID].join('/'));
            const response = await fetch(url, {
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

    /**
     * Search for questions from a specific user.
     * 
     * @param {int} userID the user id for whom to retrieve questions
     * @param {URLSearchParams} query additional search parameters
     * @returns 
     */
    static async getAllQuestions(userID, query) {
        const errorMsg = {
            error: true,
            message: errorGettingQuestionsMsg
        }

        try {
            // const url = new URL(DBService.dbEndpoint + dbQuestionEndpoint);
            const url = new URL([DBService.dbEndpoint, 'question'].join('/'));
            url.searchParams.append('pid', userID);

            // Map the incoming query the new query
            Object.entries(query).forEach(([key, value]) => {
                url.searchParams.append(key, value);
            });

            console.log('[DBService] getting all questions');

            const response = await fetch(url);

            if (!response.ok) {
                return errorMsg;
            }

            // Map the entity to the model
            const result = await response.json();
            const questionEntities = result.response.data;
            const questions = Promise.all(questionEntities.map(DBService._mapQuestionEntityToModel));

            // console.log(questions);
            // for (const questionEntity of questionEntities) {
            //     console.log(questionEntity);
            //     const questionModel = DBService._mapQuestionEntityToModel(questionEntity);
            // }
            // return result;

            return questions;

        } catch (error) {
            console.log('[DBService] error retrieving questions');
        }
    }

    /**
     * retrieves a question by the id for user.
     * 
     * @param {integer} userId user id integer retrieve questions for this user
     * @param {integer} questionId question id retrieve question bt this id
     * @returns 
     */
    static async getQuestionById(userId, questionId) {
        const errorMsg = {
            error: true,
            message: errorGettingQuestionsMsg
        }
        
        try {
            // const url = new URL(DBService.dbEndpoint + dbQuestionEndpoint);
            const url = new URL([DBService.dbEndpoint, 'question'].join('/'));
            url.searchParams.append('pid', userId);
            url.searchParams.append('id', questionId);

            const response = await fetch(url);

            if (!response.ok) {
                console.log('[DBService] get questions by id failed');
                return errorMsg;
            }

            const result = await response.json();

            // Fetch question responses
            
            console.log('[DBService] get question by id is happening');
            console.log(result);

            return result;

        } catch (err) {
            console.log('[DBService] get questions by id error: ', err.message);
            return errorMsg;
        }
    }

    static async getResponses(qid) {
        const errorMsg = {
            error: true,
            message: errorGettingAnswerMsg
        }

        try {
            const url = new URL([DBService.dbEndpoint, 'response'].join('/'));
            url.searchParams.append('qid', qid);

            const response = await fetch(url);

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
            const url = new URL([DBService.dbEndpoint, 'response'].join('/'));
            const response = await fetch(url, {
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
            console.log(postBody);
            const url = new URL([DBService.dbEndpoint, 'response', responseID].join('/'));
            const response = await fetch(url, {
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