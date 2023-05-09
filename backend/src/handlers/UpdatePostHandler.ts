import { statuses } from "../consts";
import logger from "../logger";
import { connectManager } from "../modules/ConnectManager";
import { keyChecker } from "../modules/KeyChecker";
import { v4 as uuidv4 } from 'uuid';
import IHandler from "./IHandler";

class UpdatePostHandler implements IHandler {
    async request(request: any, reply: any) {
        reply.headers('Content-Type', "application/json");
        let key = request.headers["Authorization"];
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
        console.log(data);
        if (!(data?.title && data?.salary && data?.post_id)) {
            reply.code(statuses.INVALID_ARGS);
        }
        const response = await this.putRequest(data.title, data.salary, data.post_id);
        if (response) {
            reply.code(statuses.SUCCESS);
        } else {
            reply.code(statuses.SERVER_ERROR);
        }
    }

    private async putRequest(title: string, salary: number, post_id: number): Promise<boolean> {
        const connName = uuidv4();
        const connection = connectManager.connect(connName);
        let result = false;
        try {
            await connection.none({
                text: 'UPDATE posts SET title=$1, salary=$2 WHERE post_id=$3',
                values: [title, salary, post_id]
            });
            result = true;

        } catch (e) {
            logger.error(e);
        }
        connectManager.disconnect(connName);
        return result;
    }
}

export const updatePostHandler = new UpdatePostHandler();