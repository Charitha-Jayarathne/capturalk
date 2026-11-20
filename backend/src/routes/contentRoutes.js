import express from 'express';
import { getContentByKey, saveContentByKey } from '../controllers/contentController.js';

const router = express.Router();

router.route('/:key')
  .get(getContentByKey)
  .put(saveContentByKey)
  .post(saveContentByKey);

export default router;

