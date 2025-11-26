import express from 'express';
import DBService from '../services/dbService.js';
import AuthService from '../services/authservice.js';
import ModelService from '../services/modelService.js';

/**
 * QuestionRouter class handles HTTP requests sent to the API at the /question route.
 */
class QuestionRouter {
    static questionsMessage = 'user questions endpoint';

    constructor() {
        this.router = express.Router();
        this.router.use(express.json());
    }

    getRouter() {
        this.questionRoute();
        return this.router;
    }

    questionRoute() {
        this.router.route('/')
            .get(async (req, res) => {
                const userID = req.validUser.response.id;

                console.log("The userID is: " + userID);

                const dbResponse = await DBService.getAllQuestions(userID, req.query);

                if (dbResponse.error) {
                    res.status(400);
                    res.json({
                        message: dbResponse.message
                    })
                    return;
                }

                res.status(200);
                res.json({
                    message: QuestionRouter.questionsMessage,
                    questions: dbResponse
                })
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

                // this should get the questionID (don't worry about it chief I got you)
                // commentary haha
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
                    qid: questionID,
                    message: "Just saved some great questions!"
                });
            });

        this.router.route('/:id')
            .get(async (req, res) => {
                const questionId = req.params.id;
                const userId = req.validUser.response.id;

                const dbResponse = await DBService.getQuestionById(userId, questionId);

                if (dbResponse.error) {
                    res.status(400);
                    res.json({
                        message: dbResponse.message
                    });
                    return;
                }

                console.log(JSON.stringify(dbResponse));

                res.status(200);
                res.json({
                    message: 'question retrieved',
                    data: dbResponse.response.data
                });
            })
            /*
            NOTES
            - accept here too an options list?
            - would need to reference the actual rid of the response in the db
            - this would also require validation that infact the rid of the presented option
            corresponds to the qid incoming
            - possible, perhaps not plausible
            */
            .put(async (req, res) => {
                // decompose the request (hope everything is there!)
                const question = req.body.qtext;
                const userID = req.validUser.response.id;
                const qid = req.params.id;

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
                    message: 'update question'
                });
            })
            .delete(async (req, res) => {
                const questionId = req.params.id;
                const userId = req.validUser.response.id;
                const dbResponseQ = await DBService.deleteQuestion(userId, questionId);

                if (dbResponseQ.error) {
                    res.status(400);
                    res.json({
                        message: dbResponseQ.message
                    })
                    return;
                }

                res.status(200);
                res.json({
                    message: 'delete question'
                })
            });

        /*
        The idea is that you edit responses as a part of their question object.
        Almost like a ... sub resource :0
        */
        this.router.route('/:qid/response')
            .get(async (req, res) => {
                const questionId = req.params.qid;
                const userId = req.validUser.response.id;
                const dbResponse = await DBService.getResponses(userId, questionId);

                // TODO, validate that the user requires this

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
                    responses: dbResponse
                });
            });

        /*
        The idea is that you edit responses as a part of their question object.
        Almost like a ... sub resource :0
        */
        this.router.route('/:qid/response/:id')
            .put(async (req, res) => {
                // decompose the request (hope everything is there!)
                const rid = req.params.id;
                const response = req.body.rtext;
                const correct = req.body.correct;

                // save response
                const dbResponseQ = await DBService.updateResponse(response, rid, correct);

                if (dbResponseQ.error) {
                    res.status(400);
                    res.json({
                        message: dbResponseQ.message
                    })
                    return;
                }

                res.status(200);
                res.json({
                    message: "Just updated that answer!"
                });
            })
            .delete(async (req, res) => {
                const rid = req.params.id;

                console.log("rid: " + rid);

                // save response
                const dbResponseQ = await DBService.deleteResponse(rid);

                if (dbResponseQ.error) {
                    res.status(400);
                    res.json({
                        message: dbResponseQ.message
                    })
                    return;
                }

                res.status(200);
                res.json({
                    message: "Just deleted the answer!"
                });
            });

        // To help with rewiring to the frontend
        this.router.route('/send/')
            .post(async (req, res) => {
                res.status(499);
                res.send('THIS ROUTE IS DEPRECATED');
            });
        this.router.route('/getSaved/')
            .get(async (req, res) => {
                res.status(499);
                res.send('THIS ENDPOINT IS DEPRECATED');
            });

        this.router.route('/getAnswers')
            .get(async (req, res) => {
                res.status(499);
                res.send('THIS ENDPOINT IS DEPRECATED');
            });

        this.router.route('/update/')
            .put(async (req, res) => {
                res.status(499);
                res.send('THIS ENDPOINT IS DEPRECATED');
            });

        this.router.route('/delete/')
            .delete(async (req, res) => {
                res.status(499);
                res.send('THIS ENDPOINT IS DEPRECATED');
            });

        this.router.route('/updateAnswer/')
            .put(async (req, res) => {
                res.status(499);
                res.send('THIS ENDPOINT IS DEPRECATED');
            });

        this.router.route('/deleteAnswer/')
            .delete(async (req, res) => {
                res.status(499);
                res.send('THIS ENDPOINT IS DEPRECATED');
            });
    }
}

export default QuestionRouter;
