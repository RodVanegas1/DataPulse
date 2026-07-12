import { RequestHandler } from 'express';
import { sendSuccess } from '../../../core/responses/api-response';
import { AIEngine } from '../services/AIEngine';

export class AIController {
  constructor(private readonly aiEngine = new AIEngine()) {}

  generate: RequestHandler = async (req, res, next) => {
    try {
      const response = await this.aiEngine.generate(req.body);
      return sendSuccess(res, 'AI response generated', response);
    } catch (error) {
      return next(error);
    }
  };
}
