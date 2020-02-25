import { Router, Response, Request } from "express";

import uniqueString from "../../lib/generateUnigeString";
import controller from "../interfaces/controllerInterface";
import RequestWithURL from "../interfaces/requestInterface"
import ShortenedURLService from "../services/shortened_URLService"
import shortened_URL from "../../database/entity/shortened_URL"
import logger from "../../lib/logger";
import MissingParametersException from "../exeptions/MissingParametersException";
import NotImplementedException from "../exeptions/NotImplementedException";



export default class ShortenedURL implements controller {
	public path = "/";

	public router: Router = Router();
	
	constructor() {
		this.initializeRoutes();
	}
	private initializeRoutes(): void {	
		
			this.router.get(`${this.path}:shortend`, this.one);
			this.router.post(`${this.path}/`, this.save);
			this.router.all(`${this.path}:shortend/*`, this.error);
		
	}

	private error = async (_request: Request, response?: Response): Promise<void> => {
		const error = new NotImplementedException();
		response.status(error.status).send({
			message:error.message
		});
	}
	private one = async (request: RequestWithURL, response: Response): Promise<void> => {
		
		const shortend = request.params.shortend;	
		if (!shortend) {
			const message: string = "Required parameters missing";
			logger.info(message);
			response.status(404).send(new MissingParametersException(message));
		}

		try {
			const data: any = await ShortenedURLService.getURL(shortend);

			logger.info("Called URL count increamented:", { shortend });
			response.status(200).send(data);

		} catch (error) {
			logger.info(error);
			response.status(error.status).send({
				message: error.message
			});
		}
	}
	private save = async (request: Request, response: Response): Promise<void> => {
		
		try {
			
			let newRecord = new shortened_URL();
			let uniqueStr = new uniqueString(request.body.originalURL);

			const ExistsObj = await uniqueStr.checkIfExists();
			if (ExistsObj) {
				logger.info("shortend URL already exists:", ExistsObj);
				response.status(200).send(ExistsObj);
			} else {

				newRecord.id = Math.floor(Math.random() * 10);
				newRecord.original = request.body.originalURL;
				newRecord.shortend = await uniqueStr.createShortenURL();
			
				if (!newRecord.original && !newRecord.shortend) {
					const message: string = "Required parameter [originalURL] is missing";
					throw new MissingParametersException(message);
				}

				const data: any = await ShortenedURLService.addNewURL(newRecord);

				logger.info("New shortend URL added:", data);
				response.status(200).send(data);
			}
		} catch (error) {
			logger.error(error);
			response.status(error.status).send({
				message: error.message
			});
		}
	}
	
}
