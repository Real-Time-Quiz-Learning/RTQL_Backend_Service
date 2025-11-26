import express from 'express';
import AuthService from '../services/authservice.js';

const router = express.Router();
const ADMIN_ACCESS_REQUIRED = 'Admin access required to view API statistics.';

router.use(express.json());

router.route('/')
    .get((req, res) => {
        const as = req.services.adminService;

        console.log(as.getApiStats());
        console.log(req.validUser);

        if (req.validUser.response.admin !== true) {
            res.status(403);
            res.json({
                message: ADMIN_ACCESS_REQUIRED
            });
        }
        
        res.status(200);
        res.json(as.getApiStats());
    });

export { router as AdminRouter };
