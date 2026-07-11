import { Router } from 'express';
import { validateBody, validateQuery } from '../../../shared/middlewares/validate';
import { TourismController } from '../controllers/tourism.controller';
import { createPlaceSchema, placeQuerySchema, updatePlaceSchema } from '../validators/tourism.validators';

const controller = new TourismController();

export const tourismRouter = Router();

tourismRouter.get('/places', validateQuery(placeQuerySchema), controller.listPlaces);
tourismRouter.post('/places', validateBody(createPlaceSchema), controller.createPlace);
tourismRouter.get('/places/:slug', controller.getPlace);
tourismRouter.patch('/places/:id', validateBody(updatePlaceSchema), controller.updatePlace);
tourismRouter.delete('/places/:id', controller.deletePlace);
tourismRouter.get('/categories', controller.categories);
