import express from 'express';
import DBService from '../services/dbService.js';
import AuthService from '../services/authservice.js';
import ModelService from '../services/modelService.js';

/**
 * QuestionRouter class handles HTTP requests sent to the API at the /question route.
 */
class QuestionRouter {
    constructor() {
        this.router = express.Router();
        this.router.use(express.json());
        this.router.use(AuthService.validateToken);
    }

    getRouter() {
        this.questionRoute();
        return this.router;
    }

    questionRoute() {
        this.router.route('/send/')
            .get((req, res) => {
                res.send('Hello World at the QUESTION SEND route!')
            })
            .post(async (req, res) => {

                console.log("at the question route yay");

                const questionPrompt = req.body;

                const modelResponse = await ModelService.sendQuestion(questionPrompt);

                if (modelResponse.error) {
                    res.status(400);
                    res.json({
                        message: modelResponse.message
                    })
                    return;
                }

                res.status(200);
                res.json({
                    message: "Here are some great questions!",
                    questions: modelResponse.questions
                })
            }
            );

        this.router.route('/save/')
            .get((req, res) => {
                res.send('Hello World at the QUESTION SAVE route!')
            })
            .post(async (req, res) => {

                console.log("at the question route yay");

                // decompose the request (hope everything is there!)
                const question = req.body.question;
                const answers = req.body.answers;
                const correct = req.body.correct;

                // get user ID from token response
                console.log("VALID USER: " + req.validUser);
                const userID = req.validUser.response.id;
                console.log("The userID is: " + userID);

                // save response
                const dbResponseQ = await DBService.saveQuestion(question, userID);

                console.log("AHHHH dbResponseQ: " + JSON.stringify(dbResponseQ));

                if (dbResponseQ.error) {
                    res.status(400);
                    res.json({
                        message: dbResponseQ.message
                    })
                    return;
                }

                // this should get the questionID
                const questionID = dbResponseQ.response.data.insertId;

                console.log("QUESTIONID " + questionID);
                console.log("ANSWER COUNT " + answers.Count);

                for (let i = 0; i < answers.length; i++) {
                    let dbResponseA = await DBService.saveAnswer(answers[i], questionID, i == correct);
                    if (dbResponseA.error) {
                        res.status(400);
                        res.json({
                            message: dbResponseA.message
                        })
                        return;
                    }
                }

                res.status(200);
                res.json({
                    message: "Just saved some great questions!"
                })
            }
            );

        // NOT IMPLEMENTED WAITING TO SET UP DB
        this.router.route('/getSaved/')
            .get(async (req, res) => {

                const userID = req.validUser.response.id;
                console.log("The userID is: " + userID);

                // send ID to db to get all questions
                const dbResponse = await DBService.getAllQuestions(userID);

                // TO DO: finish this part

                if (dbResponse.error) {
                    res.status(400);
                    res.json({
                        message: dbResponse.message
                    })
                    return;
                }

                res.status(200);
                res.json({
                    message: "Here are some great questions!",
                    questions: dbResponse.response.data
                })
            }
            );

    }
}


export default QuestionRouter;