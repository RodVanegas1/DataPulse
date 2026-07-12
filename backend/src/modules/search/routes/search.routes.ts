import { Router } from 'express';
import { validateQuery } from '../../../shared/middlewares/validate';
import { SearchController } from '../controllers/search.controller';
import { autocompleteQuerySchema, searchQuerySchema } from '../validators/search.validators';

const controller = new SearchController();

export const searchRouter = Router();

searchRouter.get('/', validateQuery(searchQuerySchema), controller.search);
searchRouter.get('/autocomplete', validateQuery(autocompleteQuerySchema), controller.autocomplete);
