import { statuses } from "../consts";
import logger from "../logger";
import { connectManager } from "../modules/ConnectManager";
import { keyChecker } from "../modules/KeyChecker";
import { v4 as uuidv4 } from 'uuid';
import IHandler from "./IHandler";

class AddPostHandler implements IHandler {
    async request(request: any, reply: any) {
        reply.headers('Content-Type', "application/json");
        let key = request.headers["authorization"];
        if (!key) {
            logger.error(`key: ${key}`);
            reply.code(statuses.UNAUTHORIZED);
            return;
        }
        const explicityKey = "Explicit: ";
        const index = key.indexOf(explicityKey);
        if (index === -1) {
            logger.error(`index: ${index}, key: ${key}`);
            reply.code(statuses.UNAUTHORIZED);
            return;
        }
        key = key.slice(explicityKey.length);
        const staffId = keyChecker.getOwner(key);
        if (staffId === -1) {
            logger.error(`staffId: ${staffId}, key: ${key}`);
            reply.code(statuses.UNAUTHORIZED);
            return;
        }

        const data = JSON.parse(request.body);
        if (!(data?.title && data?.salary)) {
            reply.code(statuses.INVALID_ARGS);
        }
        const post_id = await this.postRequest(data.title, data.salary);
        if (post_id === -1) {
            reply.code(statuses.SERVER_ERROR);
        } else {
            reply.code(statuses.SUCCESS).send(JSON.stringify({post_id: post_id}));
        }
    }

    private async postRequest(title: string, salary: number) {
        const connName = uuidv4();
        const connection = connectManager.connect(connName);
        let result = -1;
        try {
            const post_id = (await connection.one({
                text: 'INSERT INTO posts (title, salary) VALUES ($1, $2) RETURNING post_id;',
                values: [title, salary]
            })).post_id;
            result = post_id;

        } catch (e) {
            logger.error(e);
        }
        connectManager.disconnect(connName);
        return result;
    }
}

export const addPostHandler = new AddPostHandler();