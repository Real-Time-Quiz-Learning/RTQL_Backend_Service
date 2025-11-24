import express from 'express';

const router = express.Router();

router.use(express.json());

router.route('/')
    .get((req, res) => {
        const as = req.services.adminService;

        console.log(as.getApiStats());
        
        res.status(200);
        res.json(as.getApiStats());
    });

export { router as AdminRouter };
