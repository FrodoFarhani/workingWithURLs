import redis from "redis";

import logger from "../lib/logger";

export const Redisclient = async () => {
    try {
        const port = parseInt(process.env.REDISPORT);
        const host = process.env.REREDISURL;
        const client= redis.createClient(
            port, host
        );
        logger.info("Redis connection successful");
        return client;
    } catch (error) {
        logger.error(error);
        process.exit(1);  
        
        return undefined;
    }
    
}