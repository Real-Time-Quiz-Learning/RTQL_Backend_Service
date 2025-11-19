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
    }

    getRouter() {
        this.questionRoute();
        return this.router;
    }

    questionRoute() {
        this.router.route('/send/')
            .get((req, res) => {
                res.send('Hello World at the QUESTION route!')
            })
            .post(async (req, res) => {

                console.log("at the question route yay");

                const questionPrompt = req.body;

                // Validate the user!!!
                const token = questionPrompt.token;
                const validUser = await AuthService.validateToken(token);
                console.log("HERE WE ARE!!!");

                if (validUser.error) {
                    res.status(400);
                    res.json({
                        message: validUser.message
                    })
                    return;
                }

                console.log("user is validated. phew!");

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
            )

    }
}


export default QuestionRouter;