import express from 'express';
import { askNexaAI } from '../controllers/aiController.js';

const router = express.Router();

router.post('/recommend', askNexaAI);

export default router;

