import { Router } from 'express';
import {
  UsersController,
  AuthController,
  ObservationController,
  RingsByController,
  CatalogCotroller,
} from './controllers';
import { auth } from './services/auth-service';

const routes: Router = Router();

export default (): Router => {
  routes.use('/auth', new AuthController().init());
  routes.use('/users', new UsersController().init());
  routes.use('/observations', auth.required, new ObservationController().init());
  routes.use('/rings-by', new RingsByController().init());
  routes.use('/catalog', new CatalogCotroller().init());
  return routes;
};
