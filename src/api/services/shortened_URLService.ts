import { getRepository, getManager } from "typeorm";

import { Redisclient } from './../../config/redis';
import shortened_URL from "../../database/entity/shortened_URL"
import RecordsNotFoundException from '../exeptions/RecordsNotFoundException';
import logger from "../../lib/logger";
import { RedisClient } from "redis";



export default new class ShortenedURLService {
    private Redisclient: RedisClient;
    constructor() {
        this.initializeRedis();
    }
    public async initializeRedis() {
         this.Redisclient = await Redisclient();
    }

    public async addNewURL(mdl: shortened_URL) {
        try {
            const entityManager = getRepository(shortened_URL);
            const obj = await (await entityManager.insert(mdl)).raw[0];

            obj.original = mdl.original;
            obj.shortend = mdl.shortend;

            return obj;
        } catch (error) {
            throw error;
        }
       
    }
    public async getURL(shortend: string) {
        const cacheCount = parseInt(process.env.CACHECOUNT);
        const entityManager = getRepository(shortened_URL);
        
        try {
            const cachedObject = await this.getCache(shortend);
            if (cachedObject) {
                logger.info("Response from cache: ", { cachedObject });
                return cachedObject;
            }
        } catch (error) {
            logger.error(`${__filename} | ${error.lineNumber} | Reading from cache failed:  ${error.message}`);
        }
        
        
        const findURL = await entityManager.findOne({ where: { shortend } });
        if (!findURL) {
            const message: string = `${shortend}`;
            throw new RecordsNotFoundException(message); 
        }
        
        parseInt(findURL.count) >= cacheCount
            ? this.setCache(findURL) 
            : findURL
        this.updateURL(findURL);

        return findURL.original;
    }

    public async checkOriginalURL(original: string) {
        const entityManager = getRepository(shortened_URL);
        const findURL = await entityManager.findOne({ where: { original } });
        return findURL;
    }
    public async checkShortendURL(shortend: string) {
        const entityManager = getRepository(shortened_URL);
        const findURL = await entityManager.findOne({ where: { shortend } });
        return findURL;
    }

    private async updateURL(data: shortened_URL) {
        if (data) {
            const manager = getManager();
            await manager.increment(shortened_URL, { id: data.id }, "count", 1);
      }
    }
    private async setCache(data: shortened_URL) {
        try {
            
            const client = this.Redisclient;
            client.set(data.shortend, data.original);
        } catch (error) {
            throw error;
        }
        
        
    }
    private async getCache(key:string) {
        try {
            const client = this.Redisclient;
            return new Promise((resolve, reject) => {
                client.get(key, (err, reply) => {
                    if (err) reject(err);
                    resolve(reply);
                });
            });
        } catch (error) {
            throw error;
            
        }
       

    }

}