import { Request, Response, NextFunction, Router } from 'express';

export interface IUsersController {
	router: Router;

	test: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
