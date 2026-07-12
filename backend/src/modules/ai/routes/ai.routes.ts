import { Router } from 'express';
import { validateBody } from '../../../shared/middlewares/validate';
import { AIController } from '../controllers/ai.controller';
import { aiGenerateSchema } from '../validators/ai.validators';

const controller = new AIController();

export const aiRouter = Router();

aiRouter.post('/generate', validateBody(aiGenerateSchema), controller.generate);
