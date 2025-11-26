import express from 'express';

import ModelService from '../services/modelService.js';
import DBService from '../services/dbService.js';

const router = express.Router();

router.use(express.json());

router.route('/')
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
        });
    });

export { router as ModelRouter };
