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

                // decompose the request (hope everything is there!)
                const question = req.body.question;
                const answers = req.body.options;
                const correct = req.body.correct;

                // get user ID from token response
                const userID = req.validUser.response.id;

                // save response
                const dbResponseQ = await DBService.saveQuestion(question, userID);

                if (dbResponseQ.error) {
                    res.status(400);
                    res.json({
                        message: dbResponseQ.message
                    })
                    return;
                }

                // this should get the questionID
                const questionID = dbResponseQ.response.data.insertId;

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

        this.router.route('/getSaved/')
            .get(async (req, res) => {

                const userID = req.validUser.response.id;
                console.log("The userID is: " + userID);

                const dbResponse = await DBService.getAllQuestions(userID);

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

        this.router.route('/getAnswers')
            .get(async (req, res) => {

                const qid = req.query.qid;

                const userID = req.validUser.response.id;
                console.log("The userID is: " + userID);

                // send ID to db to get all questions
                const dbResponse = await DBService.getAnswers(qid);

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
                    message: "Here are some great answers!",
                    answers: dbResponse.response.data
                })
            }
            );


        this.router.route('/update/')
            .get((req, res) => {
                res.send('Hello World at the QUESTION UPDATE route!')
            })
            .put(async (req, res) => {

                // decompose the request (hope everything is there!)
                const question = req.body.question;
                const qid = req.body.qid;

                // get user ID from token response
                const userID = req.validUser.response.id;

                // save response
                const dbResponseQ = await DBService.updateQuestion(question, userID, qid);

                if (dbResponseQ.error) {
                    res.status(400);
                    res.json({
                        message: dbResponseQ.message
                    })
                    return;
                }

                res.status(200);
                res.json({
                    message: "Just saved some great questions!"
                })
            }
            );

        this.router.route('/delete/')
            .get((req, res) => {
                res.send('Hello World at the QUESTION DELETE route!')
            })
            .delete(async (req, res) => {

                const qid = req.body.qid;

                // save response
                const dbResponseQ = await DBService.deleteQuestion(qid);

                if (dbResponseQ.error) {
                    res.status(400);
                    res.json({
                        message: dbResponseQ.message
                    })
                    return;
                }

                res.status(200);
                res.json({
                    message: "Just deleted your question!"
                })
            }
            );

    }
}


export default QuestionRouter;