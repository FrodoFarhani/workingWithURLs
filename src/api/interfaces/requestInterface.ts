import { Request } from "express";


export default interface RequestWithURL extends Request {
  originalURL: string;
}
