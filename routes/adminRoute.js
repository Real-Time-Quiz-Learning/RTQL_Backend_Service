import express from 'express';

const router = express.Router();

router.use(express.json());

router.route('/')
    .get((req, res) => {
        const as = req.services.adminService;
        
        res.send('gaming');
    });

export { router as AdminRouter };
