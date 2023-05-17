import { statuses } from "../consts";
import logger from "../logger";
import { connectManager } from "../modules/ConnectManager";
import { v4 as uuidv4 } from 'uuid';
import BaseHandler from "./BaseHandler";

class AddPostHandler extends BaseHandler {
    async request(request: any, reply: any) {
        const staffId = await super.callMiddleware(request, reply);
        if (staffId === 0) {return true}
        reply.headers('Content-Type', "application/json");
        const data = JSON.parse(request.body);
        if (!(data?.title && data?.salary)) {
            reply.code(statuses.INVALID_ARGS);
        }
        const post_id = await this.postRequest(staffId, data.title, data.salary);
        if (post_id === -1) {
            reply.code(statuses.SERVER_ERROR);
        } else {
            reply.code(statuses.SUCCESS).send(JSON.stringify({post_id: post_id}));
        }
        return false;
    }

    private async postRequest(staffId: number, title: string, salary: number) {
        const connName = uuidv4();
        const connection = connectManager.connect(connName);
        this.middleware.setRole(staffId, connection);
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