import { statuses } from "../consts";
import logger from "../logger";
import { connectManager } from "../modules/ConnectManager";
import { v4 as uuidv4 } from 'uuid';
import BaseHandler from "./BaseHandler";

class UpdatePostHandler extends BaseHandler {
    async request(request: any, reply: any) {
        const staffId = await super.callMiddleware(request, reply);
        if (staffId === 0) {return true}
        reply.headers('Content-Type', "application/json");

        const data = JSON.parse(request.body);
        if (!(data?.title && data?.salary && data?.post_id)) {
            reply.code(statuses.INVALID_ARGS);
        }
        const response = await this.putRequest(staffId, data.title, data.salary, data.post_id);
        if (response) {
            reply.code(statuses.SUCCESS);
        } else {
            reply.code(statuses.SERVER_ERROR);
        }
        return false;
    }

    private async putRequest(staffId: number, title: string, salary: number, post_id: number): Promise<boolean> {
        const connName = uuidv4();
        const connection = connectManager.connect(connName);
        this.middleware.setRole(staffId, connection);
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