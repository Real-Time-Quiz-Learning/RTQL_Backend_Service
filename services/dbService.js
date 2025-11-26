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
     * Test a users ownership of a question.
     * 
     * @param {int} userId test this users ownership
     * @param {int} questionId test for ownership of this question
     * @returns 
     */
    static async checkQuestionOwnership(userId, questionId) {
        // Do you even own the question
        const res = await DBService.getQuestionById(userId, questionId);

        if (res.error || res.response.data.length === 0)
            throw new Error('given question is not one that you own');

        return true;
    }

    static async checkResponseOwnership(userId, questionId, responseId) {
        // Do you even own the question?
        const res1 = await DBService.getQuestionById(userId, questionId);
        if (res1.error || res1.response.data.length === 0)
            throw new Error('given question is not one that you own');

        // Does this response exist on the question
        const res2 = await DBService.getResponseById(questionId, responseId);
        if (res2.error || res2.response.data.length === 0)
            throw new Error('given response does not exist on the question');

        return true;
    }

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
            await DBService.checkQuestionOwnership(userID, questionID);     // test

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
            // console.log("in the catch block :( errorMsg: " + error);
            // return errorMsg;
            console.log('[DBService] error attempting to update a question');
            return {
                error: true,
                message: error.message
            };
        }


    }

    static async deleteQuestion(userID, questionID) {
        const errorMsg = {
            error: true,
            message: errorDeletingQuestionMsg
        }

        try {
            await DBService.checkQuestionOwnership(userID, questionID);     // test

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
            // console.log("in the catch block :( errorMsg: " + error);
            // return errorMsg;
            console.log('[DBService] error attempting to delete a question');
            return {
                error: true,
                message: error.message
            };
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

    static async getResponses(userId, questionId) {
        const errorMsg = {
            error: true,
            message: errorGettingAnswerMsg
        }

        try {
            await DBService.checkQuestionOwnership(userId, questionId);

            const url = new URL([DBService.dbEndpoint, 'response'].join('/'));
            url.searchParams.append('qid', questionId);

            const response = await fetch(url);

            if (!response.ok) {
                return errorMsg;
            }

            const result = await response.json();

            return result;

        } catch (error) {
            console.log('[DBService] error retrieving responses for a users question');
            return {
                error: true,
                message: error.message
            };
        }
    }

    /**
     * Retrieves a question's specific resopnse.
     * 
     * @param {int} questionId question id for which to retrieve a response
     * @param {int} responseId response id to retrieve
     */
    static async getResponseById(userId, questionId, responseId) {
        try {
            await DBService.checkQuestionOwnership(userId, questionId);

            const url = new URL([DBService.dbEndpoint, 'response'].join('url'));
            url.searchParams.append('qid', questionId);
            url.searchParams.append('id', responseId);

            const res = await fetch(url);

            if (res.response.data && res.response.data.length === 0)
                throw new Error('no befitting response');

            return res.response.data;

        } catch (err) {
            console.log('[DBService] error fetching response by id');
            return {
                error: true,
                message: err.message
            };
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

    // ADD QUESTION VALIDATION
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

    // ADD QUESTION VAILDATION
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