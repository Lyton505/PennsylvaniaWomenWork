// NO POPULATE VERSION

import express from 'express';
import { createWorkshop, getWorkshop } from '../controllers/workshopController';

const router = express.Router();

router.post('/workshops', createWorkshop);
// router.get('/workshops/:id', getWorkshop);
router.get('/workshops/:id', async (req: express.Request, res: express.Response) => {
    await getWorkshop(req, res);
});

export default router;

// POPULATE VERSION (if details of mentor/mentee objects are needed on the frontend like name or picture)

// import express from 'express';
// import { createWorkshop, getWorkshop } from '../controllers/workshopController';

// const router = express.Router();

// router.post('/workshops', createWorkshop);
// router.get('/workshops/:id', getWorkshop);

// export default router;
