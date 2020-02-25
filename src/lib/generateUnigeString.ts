import {  getManager } from "typeorm";
import shortened_URL from "../database/entity/shortened_URL";
import ShortenedURLService from "../api/services/shortened_URLService";
export default class uniqueString {
    private stringLengh: number;

    constructor(private readonly original: string) {
        this.stringLengh = parseInt(process.env.STRINGLENGH);
    }
    public createShortenURL = async (): Promise<string> => {
        

        let result: string = "";
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
        const charactersLength = characters.length;
        for (var i = 0; i < this.stringLengh; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        const isUnique = await this.checkURLUnique(result)
        !isUnique ? await this.createShortenURL() : result;
        
        
        return result;
    }

    private async checkURLUnique(url: string): Promise<boolean> {
        try {
            const shortend: any = await ShortenedURLService.checkShortendURL(url);
            return !shortend ? true : false;
            
        } catch (error) {
            throw new Error(error);
        }
    }
    public async checkIfExists(): Promise<shortened_URL | undefined > {
        try {
            const originalObject: any = await ShortenedURLService.checkOriginalURL(this.original);
            return originalObject ? originalObject : undefined;
            
        } catch(error) {
            throw new Error(error);
        }
    }
}