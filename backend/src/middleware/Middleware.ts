import logger from "../logger";
import IMiddleware from "./IMiddleware";
import { statuses } from "../consts";
import { keyChecker } from "../modules/KeyChecker";
import { v4 as uuidv4 } from 'uuid';
import { connectManager } from "../modules/ConnectManager";

class Middleware implements IMiddleware {
    async work(request: any, reply: any) {
        let key = request.headers["authorization"];
        if (!key) {
            logger.error(`key: ${key}`);
            reply.code(statuses.UNAUTHORIZED);
            return 0;
        }
        const explicityKey = "Explicit: ";
        const index = key.indexOf(explicityKey);
        if (index === -1) {
            logger.error(`index: ${index}, key: ${key}`);
            reply.code(statuses.UNAUTHORIZED);
            return 0;
        }
        key = key.slice(explicityKey.length);
        const staffId = keyChecker.getOwner(key);
        if (staffId === -1) {
            logger.error(`staffId: ${staffId}, key: ${key}`);
            reply.code(statuses.UNAUTHORIZED);
            return 0;
        }
        return staffId;
    }

    async setRole(staffId: number, connection: any) {
        let result = "";
        try {
            const response = await connection.proc('before_each_query', [staffId]);
            console.log(response);
            result = response.access_level;
        } catch (e) {
            logger.error(e);
        }
        return result;
    }
}

export const mainMiddleware = new Middleware();