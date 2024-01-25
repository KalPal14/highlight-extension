import { Request, Response, NextFunction, Router } from 'express';

export interface IUsersController {
	router: Router;

	login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	register: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	logout: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
